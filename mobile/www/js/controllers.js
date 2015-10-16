angular.module('starter.controllers', [])

.directive('photosList', function() {
  return {
    templateUrl: 'templates/photos-list.html',
    restrict : 'E'
  };
})

.controller('RedirectCtrl', function($scope, $location, $window,$rootScope) {
    var email = $window.localStorage['userEmail'];
    if (email) {
        $location.path('/tab/explore');
    } else {
      $location.path('/login');
    }
})

.controller('LoginCtrl', function($scope, $location, $window, Login, $ionicPopup, $rootScope) {
  $scope.data = {};

  $scope.login = function() {
    Login.save({user: $scope.data.user},
      function(data){
        $window.localStorage['userToken'] = data.user_token;
        $window.localStorage['userEmail'] = data.user_email;
        $location.path('/tab/explore');
      },
      function(err){
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: "Invalid username or password."
        });
      }
    );
  }
})

.controller('RegisterCtrl', function($scope, $location, $window, Register, $ionicPopup, $rootScope) {
  $scope.data = {};

  $scope.register = function() {
    Register.save({user: $scope.data.user},
      function(data){
        $window.localStorage['userToken'] = data.user_token;
        $window.localStorage['userEmail'] = data.user_email;
        $location.path('/tab/explore');
      },
      function(err){
        var error = "";
        var errors = err["data"]["errors"];
        for (var k in errors) {
          error += k.charAt(0).toUpperCase() + k.replace(/_/g, ' ').substring(1) + ' ' + errors[k] + '. ';
        }
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
        });
      }
    );
  }
})

.controller('ExploreCtrl', function($scope,Upload,Auth,Helper,$window,$ionicScrollDelegate) {
  $scope.title = 'explore';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  $scope.events = {};
  $scope.eventsEmpty = false;
  
  $scope.change = function () {
      Upload.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
        $scope.eventsEmpty = ($scope.events.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('MyPhotoCtrl', function($scope,myPhoto,Auth,Helper,$window,$ionicScrollDelegate) {
  $scope.title = 'myPhotos';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  $scope.events = {};
  $scope.eventsEmpty = false;
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
        $scope.eventsEmpty = ($scope.events.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('UploadInfoCtrl', function($scope, $location, $window,$rootScope) {  
})

.controller('UploadCtrl', function($scope,$ionicNavBarDelegate,Upload,Foursquare,Event,Helper,$window,Auth) {  
  $ionicNavBarDelegate.showBackButton(true);
  
  $scope.flow = {};
  $scope.current_locations = [];
  $scope.current_events = [];
  
  $scope.done = false;
  
  $scope.change = function () {
      Event.query(Auth, function(data){
        $scope.current_events = data;
      });
      $scope.done = false;
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
  
  var reset = function () {
      // [Re]set the form data.
      $scope.custom = {event: '', location: ''};
      $scope.showCustomEvent = true;
      $scope.showCustomLocation = true;
      // 'Custom' will be a reserved keyword for event and location, meaning 'custom input'.
      $scope.upload = {event: 'Custom', location: 'Custom', photos: [], copyright: true};
      $scope.locations = $scope.current_locations;
      // Reset the spinning icon.
      $scope.loading = false;
  };
  reset();

  $scope.showCustomLocationChange = function () {
    $scope.showCustomLocation = ($scope.upload.location == "Custom");
  }
  $scope.showCustomEventChange = function () {
    $scope.showCustomEvent = ($scope.upload.event == "Custom");
  }
  
  // Get current location and add the foursquare places to the list of locations.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        lat = position.coords.latitude;
        long = position.coords.longitude;
                Foursquare.get({'foursquare[lat]': lat,
                              'foursquare[long]': long}, function(e) {
                  $scope.current_locations = e.results;
                  $scope.locations = e.results;
                  $scope.upload.location = $scope.locations[0]
                });
      });
    });
  }
  
  // Automagically convert each photo to Base64 representation for use in JSON.
  $scope.processFiles = function(files){
    angular.forEach(files, function(flowFile, i){
        var fileReader = new FileReader();
        fileReader.onload = function (event) {$scope.upload.photos[i] = event.target.result;};
        fileReader.readAsDataURL(flowFile.file);        
        // Get Location data from EXIF GPS points. All EXIF processing happens here.
        EXIF.getData(flowFile.file, function(){
            var lat = Helper.toDecimal(EXIF.getTag(this,'GPSLatitude'));
            var long = Helper.toDecimal(EXIF.getTag(this,'GPSLongitude'));
            if (lat) {// Get the locations that match the EXIF GPS coordinates.
              console.log("EXIF coordinates found.");
              Foursquare.get({'foursquare[lat]': lat,
                              'foursquare[long]': long}, function(e) {
                  $scope.locations = Helper.arrayUnique($scope.locations.concat( e.results ));
                });
            }
        });
          
    });
  };
  
  // Upload the photos array.
  $scope.saveUpload = function () { 
    $scope.loading = true;
    // Set custom event/location if needed.
    if ($scope.custom.event == "Custom") { //Don't allow an event to be named "Custom"
      $scope.upload.event = '';
    } else if ($scope.upload.event == "Custom") {
      $scope.upload.event = $scope.custom.event;
    }
    if ($scope.custom.location == "Custom") { //Same thing with location.
      $scope.upload.location = '';
    } else if ($scope.upload.location == "Custom") {
      $scope.upload.location = $scope.custom.location;
    }
    
    var mergedObject = angular.extend({upload: $scope.upload}, Auth);
    Upload.save(mergedObject, function(data) {
      $scope.done = true;
      reset();
      $scope.flow.flow.cancel();
    });
  }
})


.controller('PurchasesCtrl', function($scope,Helper,Purchase,Auth,$ionicScrollDelegate) {
  $scope.title = 'purchases';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  $scope.events = {};
  $scope.eventsEmpty = false;
  
  $scope.change = function () {
      Purchase.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
        $scope.eventsEmpty = ($scope.events.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('FavoritesCtrl', function($scope,Helper,Favorites,Auth,$ionicScrollDelegate) {
  $scope.title = 'favorites';
 
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  $scope.events = {};
  $scope.eventsEmpty = false;
  
  $scope.change = function () {
      Favorites.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
        $scope.eventsEmpty = ($scope.events.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('MyPhotoDetailCtrl', function($scope, $location, $window, PurchaseAct,FavoriteAct, $ionicHistory, $stateParams, Upload, Auth) {
    $scope.photo={};
    $scope.deleting=false;
    // The download button leaves the app and thus is only usable for web views.
    
    $scope.backTitle = $ionicHistory.backTitle().toLowerCase(); // i.e., 'explore, purchases, favorites, myphotos'

    var mergedObject = angular.extend({id:$stateParams.photoId}, Auth);
    $scope.change = function (){
      Upload.update(angular.extend(mergedObject,
                                   {upload: {location: $scope.photo.location,
                                             event: $scope.photo.event,
                                             copyright: $scope.photo.copyright}
                                    }));
    }
    
    $scope.change = function () {
      Upload.get(mergedObject, function(data) {
                    $scope.photo=data;
       });
    }
    
    $scope.$on('$ionicView.beforeEnter', function() {
      // Get the object
      $scope.change();
    });
        
    $scope.deletePhoto = function () {
      $scope.deleting=true;
      Upload.delete(mergedObject, function(data) {
        $ionicHistory.goBack();
      });
    }

    $scope.purchasePhoto = function () {
      $scope.photo.current_user_purchased = true;
      PurchaseAct.save(mergedObject);
      $scope.change();
    }

    $scope.favPhoto = function () {
      $scope.photo.current_user_favorited = true;
      FavoriteAct.save(mergedObject);
      $scope.change();
      
    }

    $scope.unfavPhoto = function () {
      $scope.photo.current_user_favorited = false;
      FavoriteAct.delete(mergedObject);
      $scope.change();
    }


})

.controller('AccountCtrl', function($scope, Logout,$window,Account, Auth,$location, $ionicPopup, $rootScope ) {
  $scope.account = {};
  $scope.$on('$ionicView.enter', function () {
    Account.get(Auth, function(data) {
      $scope.account = data;
    });
  })
  
  $scope.logout = function() {
    // This database call might not be necessary, if all that's needed is to removeItems...
    Logout.delete(
      function(data){
        $window.localStorage.removeItem('userToken');
        $window.localStorage.removeItem('userEmail');
        //Reload all controllers
        $window.location.reload();  
        $location.path('/login');
      },
      function(err){
        var error = err["data"]["errors"] || err["data"]["errors"].join('. ')
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
        });
      }
    );
  }
});

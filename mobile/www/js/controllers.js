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
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})

.controller('MyPhotoCtrl', function($scope,myPhoto,Upload,Foursquare,Event,Helper,$window,Auth,$ionicScrollDelegate) {
  $scope.title = 'myPhoto';
  
  $scope.flow = {};
  $scope.current_locations = [];
  $scope.current_events = [];
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  $scope.events = {};
  $scope.eventsEmpty = false;
  
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
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
        $scope.eventsEmpty = ($scope.events.length == 0);
      });
      Event.query(Auth, function(data){
        $scope.current_events = data;
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
  
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
        fileReader.onload = function (event) {
          $scope.upload.photos[i] = event.target.result;
        };
        fileReader.readAsDataURL(flowFile.file);        
        // Get Location data from EXIF GPS points. All EXIF processing happens here.
        EXIF.getData(flowFile.file, function(){
            var lat = Helper.toDecimal(EXIF.getTag(this, 'GPSLatitude'));
            var long = Helper.toDecimal(EXIF.getTag(this, 'GPSLongitude'));
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
    if ($scope.custom.event == "Custom") {
      $scope.upload.event = '';
    } else if ($scope.upload.event == "Custom") {
      $scope.upload.event = $scope.custom.event;
    }
    if ($scope.custom.location == "Custom") {
      $scope.upload.location = '';
    } else if ($scope.upload.location == "Custom") {
      $scope.upload.location = $scope.custom.location;
    }
    var mergedObject = angular.extend({upload: $scope.upload}, Auth);
    Upload.save(mergedObject, function(data) {
      // Repopulate "my photos" to be up to date, as if reloading the page.
      $scope.events = Helper.groupPhotosByEvent(data);
      $scope.eventsEmpty = ($scope.events.length == 0);
      reset();
      $scope.flow.flow.cancel();
    });
  }
})


.controller('PurchaseCtrl', function($scope,Helper,Purchase,Auth,$ionicScrollDelegate) {
  $scope.title = 'purchase';
  
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
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})
//
//.controller('PurchaseDetailCtrl', function($scope, $window, $stateParams, Purchase, Auth) {
//    $scope.photo={};
//    Purchase.query(Auth, function(data) {
//        for(var i=0;i<data.length;i++){
//          if(data[i].id==$stateParams.photoId){
//                       $scope.photo=data[i];
//            }
//        }
//    });
//})

.controller('FavCtrl', function($scope,Helper,Favorites,Auth,$ionicScrollDelegate) {
  $scope.title = 'fav';
 
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
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})

//.controller('FavoriteDetailCtrl', function($scope, $window, $stateParams, Favorites, Auth) {
//    $scope.photo={};
//    Favorites.query(Auth, function(data) {
//        for(var i=0;i<data.length;i++){
//          if(data[i].id==$stateParams.photoId){
//                       $scope.photo=data[i];
//            }
//        }
//    });
//})

.controller('MyPhotoDetailCtrl', function($scope, $location, $window, $ionicHistory, $stateParams, Upload, Auth) {
    $scope.photo={};
    $scope.deleting=false;
    // The download button leaves the app and thus is only usable for web views.
    
    $scope.backTitle = $ionicHistory.backTitle().toLowerCase(); // i.e., 'explore'
    // BackTitle is used in the "photos-list" directive html, to generate the url
    // that goes to the given tab's full-view state.
    // Explore is named 'explore', Purchase is named 'purchase',
    // but favorite is named 'fav', and My Photos is named 'myPhoto', thus:
    switch ($scope.backTitle) {
      case "favorite":
        $scope.backTitle = "fav";
        break;
      case "my photos":
        $scope.backTitle = "myPhoto";
        break;
    }
    
    var mergedObject = angular.extend({id:$stateParams.photoId}, Auth);
    $scope.change = function (){
      Upload.update(angular.extend(mergedObject,
                                   {upload: {location: $scope.photo.location,
                                             event: $scope.photo.event,
                                             copyright: $scope.photo.copyright}
                                    }));
    }
    
    $scope.$on('$ionicView.enter', function() {
      // Get the object
      Upload.get(mergedObject, function(data) {
                    $scope.photo=data;
       });
    });
        
    $scope.deletePhoto = function () {
      $scope.deleting=true;
      Upload.delete(mergedObject, function(data) {
        $ionicHistory.goBack();
      });
    }
})

.controller('AccountCtrl', function($scope, Logout,$window,Account, Auth,$location, $ionicPopup, $rootScope ) {
  $scope.account = {};
  $scope.$on('$ionicView.enter', function () {
    Account.get(Auth, function(data) {
      $scope.account = data;
      console.log(data);
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

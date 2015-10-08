angular.module('starter.controllers', [])

.directive('photosList', function() {
  return {
    templateUrl: 'templates/photos-list.html',
    restrict : 'E'
  };
})

.controller('RedirectCtrl', function($scope, $location, $window) {
    var email = $window.localStorage['userEmail'];
    if (email) {
        $location.path('/tab/explore');
    } else {
      //Reload all controllers
      $window.location.reload();
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
        
        //Reload all controllers
        $window.location.reload();
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

.controller('ExploreCtrl', function($scope,Upload,Auth,Helper,$window) {
  $scope.title = 'explore';
  
  $scope.searchParams = {search: '', copyright: '', sort: ''};
  $scope.events = {};
  
  $scope.change = function () {
      Upload.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
      });
  };
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})

.controller('MyPhotoCtrl', function($scope,myPhoto,Upload,Foursquare,Helper,$window,Auth) {
  $scope.title = 'myPhoto';
  
  $scope.upload = {photos: [], copyright: true};
  $scope.flow = {};
  $scope.locations = [];
  $scope.current_locations = [];
  $scope.loading = false;
  
  $scope.searchParams = {search: '', copyright: '', sort: ''};
  $scope.events = {};
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
      });
  };
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
  
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
                  // Limit the locations list to size 30
                  if ($scope.locations.length > 30) {
                    $scope.locations = Helper.arrayUnique($scope.locations.concat( e.results ));
                    // Set default location.
                    if (!$scope.upload.location) {
                      $scope.upload.location = $scope.locations[0]
                    };
                  }
                });
            }
        });
          
    });
  };
  
  // Upload the photos array.
  $scope.saveUpload = function () { 
    $scope.loading = true;
    var mergedObject = angular.extend({upload: $scope.upload}, Auth);
    
    Upload.save(mergedObject, function(data) {
      // Repopulate "my photos" to be up to date, as if reloading the page.
      $scope.events = Helper.groupPhotosByEvent(data);
      // Reset the form data.
      $scope.upload = {photos: [], copyright: true};
      $scope.locations = $scope.current_locations;
      $scope.flow.flow.cancel();
      // Reset the spinning icon.
      $scope.loading = false;
    });
  }
})


.controller('PurchaseCtrl', function($scope,Helper,Purchase,Auth) {
  $scope.title = 'purchase';
  
  $scope.searchParams = {search: '', copyright: '', sort: ''};
  $scope.events = {};
  
  $scope.change = function () {
      Purchase.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
      });
  };
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})

.controller('PurchaseDetailCtrl', function($scope, $window, $stateParams, Purchase, Auth) {
    $scope.photo={};
    Purchase.query(Auth, function(data) {
        for(var i=0;i<data.length;i++){
          if(data[i].id==$stateParams.photoId){
                       $scope.photo=data[i];
            }
        }
    });
})

.controller('FavCtrl', function($scope,Helper,Favorites,Auth) {
  $scope.title = 'fav';
 
  $scope.searchParams = {search: '', copyright: '', sort: ''};
  $scope.events = {};
  
  $scope.change = function () {
      Favorites.query(angular.extend($scope.searchParams, Auth), function(data) {
        $scope.events = Helper.groupPhotosByEvent(data);
      });
  };
  $scope.$on('$ionicView.enter', function () {
      $scope.change();
  })
})

.controller('FavoriteDetailCtrl', function($scope, $window, $stateParams, Favorites, Auth) {
    $scope.photo={};
    Favorites.query(Auth, function(data) {
        for(var i=0;i<data.length;i++){
          if(data[i].id==$stateParams.photoId){
                       $scope.photo=data[i];
            }
        }
    });
})

.controller('MyPhotoDetailCtrl', function($scope, $location, $window, $ionicHistory, $stateParams, Upload, Auth) {
    $scope.photo={};
    $scope.deleting=false;
    $scope.location
    
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
        $scope.deleting=false;
      });
    }
})

.controller('AccountCtrl', function($scope, Logout,$window, $location, $ionicPopup, $rootScope ) {
  $scope.settings = {
    enableFriends: true
  };
  
  $scope.logout = function() {
    // This database call might not be necessary, if all that's needed is to removeItems...
    Logout.delete(
      function(data){
        $window.localStorage.removeItem('userToken');
        $window.localStorage.removeItem('userEmail');
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

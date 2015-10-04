angular.module('starter.controllers', [])

.controller('RedirectCtrl', function($scope, $location, $window) {
    var email = $window.localStorage['userEmail'];
    if (email) {
        $location.path('/tab/explore');
    } else {
      console.log("please login");
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
        $window.localStorage['userId'] = data.id;
        $window.localStorage['userName'] = data.name;
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

.controller('ExploreCtrl', function($scope,Chats) {
    $scope.title=' ';

/*  BlogEntry.query().$promise.then(function(response){
    $scope.blog_entries = response;
  });*/
})

.controller('MyPhotoCtrl', function($scope,$filter,myPhoto,Upload,Foursquare,$window) {
  $scope.upload = {};
  $scope.myPhotos = {};
  $scope.upload.photos = [];

  $scope.locations = [];
  
  $scope.foursquare = {};
  
  // Converter function for GPS coordinates
  var toDecimal = function (n) {
       if (n) { return n[0].numerator + n[1].numerator /
           (60 * n[1].denominator) + n[2].numerator / (3600 * n[2].denominator);
       } else { return null; }
   };
  
  //initialize myPhotos
  myPhoto.query({user_token: $window.localStorage['userToken'],
                 user_email: $window.localStorage['userEmail']}, function(data) {
                $scope.myPhotos = data;
                });
  
  // Automagically convert each photo to Base64 representation for use in JSON.
  $scope.processFiles = function(files){
    angular.forEach(files, function(flowFile, i){
      // Convert file to json
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          var uri = event.target.result;
          $scope.upload.photos[i] = uri;
        };
        fileReader.readAsDataURL(flowFile.file);
          
        //All EXIF processing happens here.
        EXIF.getData(flowFile.file, function(){
            var lat = toDecimal(EXIF.getTag(this, 'GPSLatitude'));
            var long = toDecimal(EXIF.getTag(this, 'GPSLongitude'));
            if (lat) {
              console.log("EXIF coordinates found.");
              $scope.foursquare.lat = lat;
              $scope.foursquare.long = long;
              // Get the locations that match the EXIF GPS coordinates.
              Foursquare.get({'foursquare[lat]': $scope.foursquare.lat,
                              'foursquare[long]': $scope.foursquare.long}, function(e) {
                  console.log(e);
                  // Add new locations to our list
                  $scope.locations = e.results;
                });
            } else {
              console.log("EXIF coordinates NOT found.");
            }
        });
          
    });
  };
  
  // Upload the batch (the photos array).
  $scope.saveUpload = function () {
    Upload.save({upload: $scope.upload,
                 user_token: $window.localStorage['userToken'],
                 user_email: $window.localStorage['userEmail']}, function(data) {
      // There will be some feedback to the user here.
      $scope.myPhotos = data;
      $flow.files = [];
      $scope.upload.photos = [];
    });
  }
})


.controller('PurchaseCtrl', function($scope) {
  $scope.title=' ';
})

.controller('FavCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
    console.log($scope.chat);

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

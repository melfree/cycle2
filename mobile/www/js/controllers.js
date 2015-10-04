angular.module('starter.controllers', [])

.controller('RedirectCtrl', function($scope, $location, $window) {
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

.controller('MyPhotoCtrl', function($scope,myPhoto,Upload,Foursquare,$window,Auth) {
  $scope.upload = {};
  $scope.myPhotos = {};
  $scope.upload.photos = [];
  $scope.flow = {};
  $scope.locations = [];
  $scope.loading = false;
  
  // Initialize myPhotos.
  myPhoto.query(Auth, function(data) {
                  $scope.myPhotos = data;
                });
  
  // Helper converter function for GPS coordinates, which are stored as arrays
  // and must be converted to decimals.
  var toDecimal = function (n) {
       if (n) { return n[0].numerator + n[1].numerator /
           (60 * n[1].denominator) + n[2].numerator / (3600 * n[2].denominator);
       } else { return null; }
   };
  
  // Automagically convert each photo to Base64 representation for use in JSON.
  $scope.processFiles = function(files){
    angular.forEach(files, function(flowFile, i){
        // Convert images file to json.
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          $scope.upload.photos[i] = event.target.result;
        };
        fileReader.readAsDataURL(flowFile.file);        
        // Get Location data from EXIF GPS points. All EXIF processing happens here.
        EXIF.getData(flowFile.file, function(){
            var lat = toDecimal(EXIF.getTag(this, 'GPSLatitude'));
            var long = toDecimal(EXIF.getTag(this, 'GPSLongitude'));
            if (lat) {// Get the locations that match the EXIF GPS coordinates.
              console.log("EXIF coordinates found.");
              Foursquare.get({'foursquare[lat]': lat,
                              'foursquare[long]': long}, function(e) {
                  // Any uniqueness filter should be applied here...
                  $scope.locations = $scope.locations.concat( e.results );
                });
            } else { console.log("EXIF coordinates NOT found."); }
        });
          
    });
  };
  
  // Upload the photos array.
  $scope.saveUpload = function () { 
    $scope.loading = true;
    Upload.save({upload: $scope.upload,
                 user_token: $window.localStorage['userToken'],
                 user_email: $window.localStorage['userEmail']}, function(data) {
      // Repopulate "my photos" to be up to date
      $scope.myPhotos = data;
      // Reset form data
      $scope.upload = {};
      $scope.upload.photos = []; 
      $scope.locations = [];
      $scope.flow.flow.cancel();   
      $scope.loading = false;
    });
  }
})


.controller('PurchaseCtrl', function($scope,Purchase,Auth) {
    $scope.purchase={}
    Purchase.query(Auth, function(data) {
      console.log(data);
        $scope.purchase = data;
    });

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

.controller('ChatDetailCtrl', function($scope,$stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
    console.log($scope.chat);
})

.controller('MyPhotoDetailCtrl', function($scope, $window,  $stateParams, myPhoto, Auth) {
    $scope.photo={};
    myPhoto.query(Auth, function(data) {
                  for(var i =0;i<data.length;i++){
                    if(data[i].id==$stateParams.photoId){
                      $scope.photo=data[i];
                }
            }
     });
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

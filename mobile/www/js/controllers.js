angular.module('starter.controllers', [])

.controller('RedirectCtrl', function($scope, $location, $window) {
    var email = $window.localStorage['userEmail'];
    if (email) {
        console.log("already logged in as " + email);
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

.controller('MyPhotoCtrl', function($scope,myPhoto,Upload,$window) {
  $scope.upload = {};
  $scope.myPhotos = {};
  $scope.upload.photos = [];
  
  //initialize myPhotos
  myPhoto.query({user_token: $window.localStorage['userToken'],
               user_email: $window.localStorage['userEmail']}, function(data) {
                  $scope.myPhotos = data;
                });
  // Automagically convert each photo to Base64 representation for use in JSON.
  $scope.processFiles = function(files){
    angular.forEach(files, function(flowFile, i){
       var fileReader = new FileReader();
          fileReader.onload = function (event) {
            var uri = event.target.result;
              $scope.upload.photos[i] = uri;     
          };
          fileReader.readAsDataURL(flowFile.file);
    });
  };
  
  // Upload the batch, including the photos array.
  $scope.saveUpload = function () {
    $scope.upload.event = "Test Event";
    $scope.upload.location = "Test Location";
    Upload.save({upload: $scope.upload,
                 user_token: $window.localStorage['userToken'],
                 user_email: $window.localStorage['userEmail']}, function(data) {
      // There will be some feedback to the user here.
      $scope.myPhotos = data;
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

.controller('ChatDetailCtrl', function($scope,$stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
    console.log($scope.chat);
})

.controller('MyPhotoDetailCtrl', function($scope, $window,  $stateParams, myPhoto) {
    console.log('hahaa');
    $scope.photo={};
    myPhoto.query({user_token: $window.localStorage['userToken'],
               user_email: $window.localStorage['userEmail']}, function(data) {
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

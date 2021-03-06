angular.module('starter.controllers', ['ngOpenFB'])

.directive('photosList', function() {
  return {
    templateUrl: 'templates/photos-list.html',
    restrict : 'E'
  };
})

.controller('RedirectCtrl', function($ionicHistory, $scope, $location, $window,$rootScope) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.$on('$ionicView.enter', function () {
      var email = $window.localStorage['userEmail'];
      if (email) {
          $location.path('/tab/explore');
      } else {
          $location.path('/login');
      }
    });
})

.controller('UploadRedirectCtrl', function($scope, $state,$location, $window,$rootScope) {
    $scope.$on('$ionicView.enter', function () {
      // Cheat on getting to the 'upload page'.
      // We use a global variable to remember that we want to go straight to upload page,
      // so then we go straight to upload page when we hit myPhotos.
      // This ensures that Ionic's MyPhotos history remains accurate, since we just from
      // one tab's master view to another tab's child view.
      // (For some reason, such nested view handling does not exist in Ionic yet.)
      $rootScope.upload_cheat = true;
      $location.path('/tab/myphotos');
    });
})

.controller('LoginCtrl', function($scope, $location, Auth, $window, Login, $ionicPopup, $rootScope, ngFB, UserExists, Register) {
  $scope.data = {};

  $scope.login = function() {
    Login.save({user: $scope.data.user},
      function(data){
        Auth.set(data);
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

  $scope.fbLogin = function () {
    ngFB.login({scope: 'public_profile, user_friends, email'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name,email'}
                }).then(
                    function (user) {
                        var token;
                        //if user does not already exist, regsiter as new user
                        UserExists.get({email: user.email}, function(data) {
                          token = data.user_token;
                          $rootScope.facebook = true;
                        if (!token) {
                          var userData = {}; // create an empty array
                          userData.email = user.email
                          userData.password = "password"
                          userData.password_confirmation = "password"
                          Register.save({user: userData},
                            function(data){
                              Auth.set(data);
                              $location.path('/tab/explore');
                            });
                        } else {
                          Auth.set(data);
                          $location.path('/tab/explore');
                        }

                        });
                    },
                    function (error) {
                        alert('Facebook error: ' + error.error_description);
                });
                $location.path('/tab/explore');
            } else {
                alert('Facebook login failed');
            }
        });
  }
})

.controller('RegisterCtrl', function($scope, $location, Auth, $window, Register, $ionicPopup, $rootScope) {
  $scope.data = {};

  $scope.register = function() {
    Register.save({user: $scope.data.user},
      function(data){
        Auth.set({user_token: data.user_token,
                  user_email: data.user_email});
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

.controller('ExploreCtrl', function($scope,Upload,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'explore';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Upload.query(angular.extend($scope.searchParams, Auth.get()), function(data) {
        PhotoList.setPhotos('explore', data);
        $scope.events = PhotoList.getGroupedPhotos('explore');
        $scope.eventsEmpty = PhotoList.photosEmpty('explore');
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('FullSizeCtrl', function($scope,Auth,Upload,$window,$stateParams) {
  Upload.get(angular.extend({id:$stateParams.photoId}, Auth.get()), function(data) {$scope.photo = data;});
})

.controller('MyPhotoCtrl', function($rootScope,$state,$scope,myPhoto,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'myphotos';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth.get()), function(data) {
        PhotoList.setPhotos('myphotos', data);
        $scope.events = PhotoList.getGroupedPhotos('myphotos');
        $scope.eventsEmpty = PhotoList.photosEmpty('myphotos');
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
    if ($rootScope.upload_cheat) {
      $rootScope.upload_cheat = false;
      $state.go('tab.upload');
    }
    else {
      $scope.change();
    }
  })
})

.controller('PurchasesCtrl', function($scope,PhotoList,Purchase,Auth,$ionicScrollDelegate) {
  $scope.title = 'purchases';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Purchase.query(angular.extend($scope.searchParams, Auth.get()), function(data) {
        PhotoList.setPhotos('purchases', data);
        $scope.events = PhotoList.getGroupedPhotos('purchases');
        $scope.eventsEmpty = PhotoList.photosEmpty('purchases');
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('FavoritesCtrl', function($scope,PhotoList,Favorites,Auth,$ionicScrollDelegate) {
  $scope.title = 'favorites';
 
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Favorites.query(angular.extend($scope.searchParams, Auth.get()), function(data) {
        PhotoList.setPhotos('favorites', data);
        $scope.events = PhotoList.getGroupedPhotos('favorites');
        $scope.eventsEmpty = PhotoList.photosEmpty('favorites');
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('MyPhotoDetailCtrl', function($scope,$state, $location, $window,PhotoList,PurchaseAct,FavoriteAct, $ionicHistory, $stateParams, Upload, Auth) {
    $scope.photo={};
    $scope.deleting=false;
    
    $scope.backTitle = $ionicHistory.backTitle().toLowerCase();
    // Used for dynamic urls, i.e., 'explore, purchases, favorites, myphotos'

    $scope.change = function(id) {
      $scope.merged = angular.extend({id:$stateParams.photoId}, Auth.get());
      $scope.photo = PhotoList.getPhoto($scope.backTitle, $stateParams.photoId);
      if (!($scope.photo)) { // this photo doesn't exist here anymore
        $ionicHistory.goBack();
      }
    };
    
    $scope.swipeLeft = function () {
      if ($scope.photo.left_id) $scope.goTo($scope.photo.left_id);
    };
    $scope.swipeRight = function () {
      if ($scope.photo.right_id) $scope.goTo($scope.photo.right_id);
    };
    
    $scope.goTo = function(id) {
      // Change the photo in this state (without creating another state).
      // I tried going to another state here, but this causes issues with
      // Ionic history and the back button. (Ionic thinks each state is a child of
      // the previous state.) So we stay in one state for navigating left and right.
      // ... Unfortunately, this means there cant be any swipe animation.
      $stateParams.photoId = id;
      $scope.change();
    };
    
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.change();
    });
    
    $scope.update = function (){
      Upload.update(
        angular.extend($scope.merged,
                     {upload: {location: $scope.photo.location,
                               event: $scope.photo.event}
                      }));
    }
    
        
    $scope.deletePhoto = function () {
      $scope.deleting=true;
      Upload.delete($scope.merged, function(data) {
        $ionicHistory.goBack();
      });
    }

    // For these 3 actions, we do not fetch data from the backend.
    // We could, but the changes involved are simple, so we don't need to.
    $scope.purchasePhoto = function () {
      $scope.photo.current_user_purchased = true;
      PurchaseAct.save($scope.merged, function () {
        $scope.photo.num_purchases += 1;
      });
    }

    $scope.favPhoto = function () {
      $scope.photo.current_user_favorited = true;
      FavoriteAct.save($scope.merged, function () {
        $scope.photo.num_favorites += 1;
      });
    }

    $scope.unfavPhoto = function () {
      $scope.photo.current_user_favorited = false;
      FavoriteAct.delete($scope.merged, function() {  
        $scope.photo.num_favorites -= 1;
      });
    }
})

.controller('PaymentCtrl', function($scope,PhotoList,$ionicPopup,Auth,$ionicScrollDelegate) {
  $scope.card=false;
  $scope.cardNumber="";
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Creit Card Added',
     template: 'We received yout credit card information. You can purchase photo now.'
   });
   alertPopup.then(function(res) {
    $scope.card=true;
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
  })
     
.controller('AccountCtrl', function($scope, Logout,$window,Account, Auth,$location, $ionicPopup, $rootScope, ngFB) {
  $scope.account = {};
  $scope.$on('$ionicView.beforeEnter', function () {
    Account.get(Auth.get(), function(data) {
      $scope.account = data;
      $scope.facebook = $rootScope.facebook;
      // getFacebookInfo();
    })  // $scope.getFacebookInfo = function () {
      if ($scope.facebook) {
      ngFB.api({
          path: '/me',
          params: {fields: 'id,name'}
      }).then(
          function (user) {
              $scope.user = user;
          },
          function (error) {
              alert('Facebook error: ' + error.error_description);
      });
    };
  });



  // add location and email 

  // }
  
  $scope.logout = function() {
    // This database call might not be necessary, if all that's needed is to removeItems...
    Logout.delete(
      function(data){
        $window.localStorage.removeItem('userToken');
        $window.localStorage.removeItem('userEmail');
        //Reload all controllers
        $rootScope.facebook = false;
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
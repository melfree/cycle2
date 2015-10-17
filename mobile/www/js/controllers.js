angular.module('starter.controllers', [])

.directive('photosList', function() {
  return {
    templateUrl: 'templates/photos-list.html',
    restrict : 'E'
  };
})

.controller('RedirectCtrl', function($scope, $location, $window,$rootScope) {
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

.controller('ExploreCtrl', function($scope,Upload,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'explore';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Upload.query(angular.extend($scope.searchParams, Auth), function(data) {
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

.controller('MyPhotoCtrl', function($rootScope,$state,$scope,myPhoto,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'myphotos';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth), function(data) {
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
      Purchase.query(angular.extend($scope.searchParams, Auth), function(data) {
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
      Favorites.query(angular.extend($scope.searchParams, Auth), function(data) {
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
      $scope.merged = angular.extend({id:$stateParams.photoId}, Auth);
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

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

.controller('ExploreCtrl', function($scope,Upload,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'explore';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Upload.query(angular.extend($scope.searchParams, Auth), function(data) {
        PhotoList.setPhotos(data);
        $scope.events = PhotoList.getGroupedPhotos();
        $scope.eventsEmpty = PhotoList.photosEmpty();
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('MyPhotoCtrl', function($scope,myPhoto,Auth,PhotoList,$window,$ionicScrollDelegate) {
  $scope.title = 'myphotos';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      myPhoto.query(angular.extend($scope.searchParams, Auth), function(data) {
        PhotoList.setPhotos(data);
        $scope.events = PhotoList.getGroupedPhotos();
        $scope.eventsEmpty = PhotoList.photosEmpty();
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('PurchasesCtrl', function($scope,PhotoList,Purchase,Auth,$ionicScrollDelegate) {
  $scope.title = 'purchases';
  
  $scope.searchParams = {search: '', copyright: '', sort: 'created_at'};
  
  $scope.change = function () {
      Purchase.query(angular.extend($scope.searchParams, Auth), function(data) {
        PhotoList.setPhotos(data);
        $scope.events = PhotoList.getGroupedPhotos();
        $scope.eventsEmpty = PhotoList.photosEmpty();
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
        PhotoList.setPhotos(data);
        $scope.events = PhotoList.getGroupedPhotos();
        $scope.eventsEmpty = PhotoList.photosEmpty();
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
    // i.e., 'explore, purchases, favorites, myphotos'

    var mergedObject = angular.extend({id:$stateParams.photoId}, Auth);
    $scope.update = function (){
      Upload.update(angular.extend(mergedObject,
                                   {upload: {location: $scope.photo.location,
                                             event: $scope.photo.event}
                                    }));
    }
    
    $scope.change = function () {      
      $scope.photo = PhotoList.getPhoto($stateParams.photoId);
    }
    
    $scope.goTo = function(id) {
      $state.go($state.current, {photoId: id}, {reload: true});
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
      PurchaseAct.save(mergedObject, function (data) {
        $scope.photo.num_purchased += 1;
      });
    }

    $scope.favPhoto = function () {
      $scope.photo.current_user_favorited = true;
      FavoriteAct.save(mergedObject, function (data) {
        $scope.photo.num_favorited += 1;
      });
    }

    $scope.unfavPhoto = function () {
      $scope.photo.current_user_favorited = false;
      FavoriteAct.delete(mergedObject, function(data) {  
        $scope.photo.num_favorited -= 1;
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

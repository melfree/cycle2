angular.module('starter.controllers', [])

///////////////
//Purchase logs
.controller('PurchasesLogCtrl', function($scope,Auth,$stateParams,PurchaseLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Purchase History';
  $scope.logs = {};
  var mergedObject = angular.extend({id:$stateParams.photoId}, Auth);
  $scope.change = function () {
      PurchaseLog.query(mergedObject, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('UserPurchasesLogCtrl', function($scope,Auth,$stateParams,PurchaseLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Purchase History';
  $scope.logs = {};
  $scope.change = function () {
      PurchaseLog.query(Auth, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('RevUserPurchasesLogCtrl', function($scope,Auth,$stateParams,RevPurchaseLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Sales History';
  $scope.logs = {};
  $scope.change = function () {
      PurchaseLog.query(Auth, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

///////////////
//Favorite logs
.controller('UserFavoritesLogCtrl', function($scope,Auth,$stateParams,FavoriteLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Favorites History';
  $scope.logs = {};
  $scope.change = function () {
      FavoriteLog.query(Auth, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('FavoritesLogCtrl', function($scope,Auth,$stateParams,FavoriteLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Favorites History';
  $scope.logs = {};
  var mergedObject = angular.extend({id:$stateParams.photoId}, Auth);
  $scope.change = function () {
      FavoriteLog.query(mergedObject, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
})

.controller('RevUserFavoritesLogCtrl', function($scope,Auth,$stateParams,RevFavoriteLog,$window,$ionicScrollDelegate) {
  $scope.title = 'Favorites of Your Photos';
  $scope.logs = {};
  $scope.change = function () {
      FavoriteLog.query(Auth, function(data) {
        $scope.logs = data;
        $scope.logsEmpty = ($scope.logs.length == 0);
      });
      $ionicScrollDelegate.resize();
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
});
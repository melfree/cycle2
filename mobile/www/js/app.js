// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['flow', 'ionic', 'starter.controllers', 'starter.services', 'ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(true);
  $ionicConfigProvider.platform.android.tabs.position("bottom");
 })
  
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('redirect', {
    url: '/redirect',
    templateUrl: 'templates/login.html',
    controller: 'RedirectCtrl'
  })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.explore', {
    url: '/explore',
    views: {
      'tab-explore': {
        templateUrl: 'templates/tab-explore.html',
        controller: 'ExploreCtrl'
      }
    }
  })
  
  .state('tab.explore-detail', {
    url: '/explore/:photoId',
    views: {
      'tab-explore': {
        templateUrl: 'templates/photo-detail.html',
        controller: 'MyPhotoDetailCtrl'
      }
    }
  })
  
  .state('tab.explore-full-size', {
      url: '/explore/:photoId/full-size',
      views: {
        'tab-explore': {
          templateUrl: 'templates/photo-full.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
  })

  .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

      .state('tab.favorites-detail', {
      url: '/favorites/:photoId',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/photo-detail.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })
      
    .state('tab.favorites-full-size', {
      url: '/favorites/:photoId/full-size',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/photo-full.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })

    .state('tab.myPhotos', {
      url: '/myPhotos',
      views: {
        'tab-myPhotos': {
          templateUrl: 'templates/tab-myPhotos.html',
          controller: 'MyPhotoCtrl'
        }
      }
    })
    
    .state('tab.upload', {
      url: '/upload',
      views: {
        'tab-myPhotos': {
          templateUrl: 'templates/upload.html',
          controller: 'UploadCtrl'
        }
      }
    })

    .state('tab.photo-detail', {
      url: '/myPhotos/:photoId',
      views: {
        'tab-myPhotos': {
          templateUrl: 'templates/photo-detail.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })
    
    .state('tab.photo-full-size', {
      url: '/myPhotos/:photoId/full-size',
      views: {
        'tab-myPhotos': {
          templateUrl: 'templates/photo-full.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })

    .state('tab.purchases', {
      url: '/purchases',
      views: {
        'tab-purchases': {
          templateUrl: 'templates/tab-purchases.html',
          controller: 'PurchasesCtrl'
        }
      }
    })

    .state('tab.purchases-detail', {
      url: '/purchases/:photoId',
      views: {
        'tab-purchases': {
          templateUrl: 'templates/photo-detail.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })
    
    .state('tab.purchases-full-size', {
      url: '/purchases/:photoId/full-size',
      views: {
        'tab-purchases': {
          templateUrl: 'templates/photo-full.html',
          controller: 'MyPhotoDetailCtrl'
        }
      }
    })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/redirect');

});
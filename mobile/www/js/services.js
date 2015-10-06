angular.module('starter.services', [])

.factory('Helper', function() {
  //Helper Function to get unique values from an array.
  var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
  };
  
  // Helper converter function for GPS coordinates, which are stored as arrays
  // and must be converted to decimals.
  var toDecimal = function (n) {
       if (n) { return n[0].numerator + n[1].numerator /
           (60 * n[1].denominator) + n[2].numerator / (3600 * n[2].denominator);
       } else { return null; }
   };
  
  var groupPhotosByEvent = function (data, event_keys, events) {
      event_keys = [];
      events = {};
      for (var i in data) {
        var p = data[i];
        if (p.event) {
          // Add the event to the list of event keys.
          event_keys.push(p.event);
          var a;
          // Add the photo object to the event hash.
          if (events[p.event]) {
            a = events[p.event].concat([p]);
          } else {
            a = [p];
          }
          events[p.event] = a;
          }
      }
      // Remove duplicates from the event keys array.
      event_keys = arrayUnique(event_keys);
      return {event_keys: event_keys, events: events}
    }
  
  //Helper function to group photos by a common event.
  return {
    arrayUnique: arrayUnique,
    groupPhotosByEvent: groupPhotosByEvent,
    toDecimal: toDecimal
  }
})

.factory('Login', function($resource) {
  return $resource("http://localhost:3000/users/sign_in.json");
})

.factory('Auth',function($window){
  var auth={};
  auth.user_token=$window.localStorage['userToken'];
  auth.user_email=$window.localStorage['userEmail'];
  return auth;
})

.factory('Register', function($resource) {
  return $resource("http://localhost:3000/users.json");
})

.factory('Logout', function ($resource) {
  return $resource("http://localhost:3000/users/sign_out.json");
})

.factory('myPhoto', function ($resource) {
  return $resource("http://localhost:3000/myphotos.json");
})

.factory('Purchase', function ($resource) {
  return $resource("http://localhost:3000/purchases.json");
})

.factory('Favorites', function ($resource) {
  return $resource("http://localhost:3000/favorites.json");
})

.factory('Foursquare', function ($resource) {
  return $resource("http://localhost:3000/foursquare.json");
})

.factory('Upload', function ($resource) {
  return $resource("http://localhost:3000/uploads/:id.json", {id: '@id'}, {
      // All other CRUD operations are available to factories by default
      update: {
          method: 'PUT'
        },
      save: {
          method:'POST', isArray: true
      }
    }
  );
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

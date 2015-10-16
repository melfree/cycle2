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
  
  //Helper function to group photos by a common event.
  return {
    arrayUnique: arrayUnique,
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

.factory('PurchaseAct', function ($resource) {
  return $resource("http://localhost:3000/purchases/:id.json",{id: '@id'});
})

.factory('Favorites', function ($resource) {
  return $resource("http://localhost:3000/favorites.json");
})

.factory('FavoriteAct', function ($resource) {
  return $resource("http://localhost:3000/favorites/:id.json",{id: '@id'});
})

.factory('FavoriteLog', function ($resource) {
  return $resource("http://localhost:3000/favoritelog/:id.json",{id: '@id'});
})
.factory('PurchaseLog', function ($resource) {
  return $resource("http://localhost:3000/purchaselog/:id.json",{id: '@id'});
})
.factory('RevFavoriteLog', function ($resource) {
  return $resource("http://localhost:3000/revfavoritelog.json");
})
.factory('RevPurchaseLog', function ($resource) {
  return $resource("http://localhost:3000/revpurchaselog.json");
})

.factory('Foursquare', function ($resource) {
  return $resource("http://localhost:3000/foursquare.json");
})

.factory('Event', function ($resource) {
  return $resource("http://localhost:3000/events.json");
})

.factory('Account', function ($resource) {
  return $resource("http://localhost:3000/account.json");
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

.factory('PhotoList', function() {
  var allHash = {};
  allHash['explore'] = {};
  allHash['myphotos'] = {};
  allHash['favorites'] = {};
  allHash['purchases'] = {};
  
  var groupPhotosByEvent = function(hash, data) {
      hash.groupedPhotos = [];
      hash.photos = [];
      hash.idHash = {};
      var lastSeen = null;
      var lastSeenWithTime = null;
      
      for (var i = 0; i < data.length; i++) {
        var a; var e;
        var p = data[i];
        if (p.id) {
          // First build an array that used to keep track of ordering of photos.
          if (i != 0) {
            p.left_id = hash.photos[i-1].id;
            hash.photos[i-1].right_id = p.id;
          }
          hash.idHash[p.id] = i;
          hash.photos.push(p);
          
          // Now build a list grouped by event
          if (p.event) {
            e = p.event;
          } else {
            e = "N/A";
          }
          // Add the event to the list of event keys, if it's new.
          if (lastSeen == e) {
            photoList = photoList.concat([p]);
          } else {
            // This is a new event, so save the old list and start a new list.
            if (lastSeenWithTime) hash.groupedPhotos.push({name: lastSeenWithTime, photos: photoList});
            lastSeen = e;
            lastSeenWithTime = e + " - " + p.created_at;
            photoList = [p];
          }
        }
      }
      if (lastSeenWithTime) hash.groupedPhotos.push({name: lastSeenWithTime, photos: photoList});
    };
  
  return {
    photosEmpty: function(name) {
      return allHash[name].groupedPhotos.length == 0;
    },
    setPhotos: function(name, data) {
      groupPhotosByEvent(allHash[name], data);
    },
    getGroupedPhotos: function(name) {
      return allHash[name].groupedPhotos;
    },
    getPhoto: function(name, id) {
      var index = allHash[name].idHash[id];
      return allHash[name].photos[index];
    }
  };
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

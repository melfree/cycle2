angular.module('starter.controllers')

.controller('UploadInfoCtrl', function($scope, $location, $window,$rootScope) {  
})

.controller('UploadCtrl', function($scope,$ionicNavBarDelegate,Upload,Foursquare,Event,Helper,$window,Auth) {  
  $scope.flow = {};
  $scope.current_locations = [];
  $scope.current_events = [];
  
  $scope.done = false;
  
  $scope.change = function () {
      Event.query(Auth, function(data){
        $scope.current_events = data;
      });
      $scope.done = false;
  };
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.change();
  })
  
  var reset = function () {
      // [Re]set the form data.
      $scope.custom = {event: '', location: ''};
      $scope.showCustomEvent = true;
      $scope.showCustomLocation = true;
      // 'Custom' will be a reserved keyword for event and location, meaning 'custom input'.
      $scope.upload = {event: 'Custom', location: 'Custom', photos: [], copyright: true};
      $scope.locations = $scope.current_locations;
      // Reset the spinning icon.
      $scope.loading = false;
  };
  reset();

  $scope.showCustomLocationChange = function () {
    $scope.showCustomLocation = ($scope.upload.location == "Custom");
  }
  $scope.showCustomEventChange = function () {
    $scope.showCustomEvent = ($scope.upload.event == "Custom");
  }
  
  // Get current location and add the foursquare places to the list of locations.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        lat = position.coords.latitude;
        long = position.coords.longitude;
                Foursquare.get({'foursquare[lat]': lat,
                              'foursquare[long]': long}, function(e) {
                  $scope.current_locations = e.results;
                  $scope.locations = e.results;
                  $scope.upload.location = $scope.locations[0]
                });
      });
    });
  }
  
  // Automagically convert each photo to Base64 representation for use in JSON.
  $scope.processFiles = function(files){
    angular.forEach(files, function(flowFile, i){
        var fileReader = new FileReader();
        fileReader.onload = function (event) {$scope.upload.photos[i] = event.target.result;};
        fileReader.readAsDataURL(flowFile.file);        
        // Get Location data from EXIF GPS points. All EXIF processing happens here.
        EXIF.getData(flowFile.file, function(){
            var lat = Helper.toDecimal(EXIF.getTag(this,'GPSLatitude'));
            var long = Helper.toDecimal(EXIF.getTag(this,'GPSLongitude'));
            if (lat) {// Get the locations that match the EXIF GPS coordinates.
              console.log("EXIF coordinates found.");
              Foursquare.get({'foursquare[lat]': lat,
                              'foursquare[long]': long}, function(e) {
                  $scope.locations = Helper.arrayUnique($scope.locations.concat( e.results ));
                });
            }
        });
          
    });
  };
  
  // Upload the photos array.
  $scope.saveUpload = function () { 
    $scope.loading = true;
    // Set custom event/location if needed.
    if ($scope.custom.event == "Custom") { //Don't allow an event to be named "Custom"
      $scope.upload.event = '';
    } else if ($scope.upload.event == "Custom") {
      $scope.upload.event = $scope.custom.event;
    }
    if ($scope.custom.location == "Custom") { //Same thing with location.
      $scope.upload.location = '';
    } else if ($scope.upload.location == "Custom") {
      $scope.upload.location = $scope.custom.location;
    }
    
    var mergedObject = angular.extend({upload: $scope.upload}, Auth);
    Upload.save(mergedObject, function(data) {
      $scope.done = true;
      reset();
      $scope.flow.flow.cancel();
    });
  }
})


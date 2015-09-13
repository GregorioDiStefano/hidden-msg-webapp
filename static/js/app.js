angular.module('dropzone', []).directive('dropzone', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
});


angular.module('hm', ['dropzone']);

    angular.module("hm")
            .controller("SomeCtrl", function($scope, $http) {

                $scope.dropzoneConfig = {
                    'options': {
                        "maxFilesize" : "5",
                        "acceptedFiles" : "image/*",
                        "uploadMultiple" : false,
                        "url": '/img/post',
                        "maxFiles" : 1,
                    },
                    'eventHandlers': {
                        'sending': function (file, xhr, formData) {

                        },
                        'success': function (file, response) {
                            alert("Success!")
                        }
                    }
                };
            })

            .controller("MyController", function($scope,  $http) {

                $scope.got_response = false;
                $scope.hide_encode = true;
                $scope.decode_view = false;
                $scope.Data = {}
                $scope.encode = {};
                $scope.Image = {};


                $scope.ValidRegex = function () {
                    if ($scope.Data.payload == undefined)
                        return true

                    if ($scope.Data.payload == "" || $scope.Data.payload.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
                        return true
                };

                $scope.images = [
                {
                    "id": 0,
                    "name": "Earth porn"
                },
                {
                    "id": 1,
                    "name": "NorwayPics"
                }]

                $scope.show_encode = function() {
                    $scope.got_response = false;
                    $scope.encode_view = true;
                    $scope.decode_view = false;
                    $scope.encode_result_view = false;
                }

                $scope.show_decode = function() {
                    $scope.encode_view = false;
                    $scope.decode_view = true;
                    $scope.encode_result_view = false;
                }


                $scope.encode.doClick = function(event) {

                    $http({
                        url: '/api',
                        method: "POST",
                        data: { 'message' : $scope.Data.payload, 'image' : $scope.Image.id}
                    })
                    .success(function(data, status, headers, config){
                        if (data.result){
                            alert(data.result)
                        } else if (data.error) {
                            ;
                    }})
                    .then(function(response) {
                            $scope.encode_view = false;
                            $scope.encode_result_view = true;
                            $scope.encode.image_data = response["data"]["encoded_images"][0]
                    },
                    function(response) {
                            $scope.result = "failed! :("
                    });
                }
                $scope.Image.update = function(itm){

                }
            }
 );




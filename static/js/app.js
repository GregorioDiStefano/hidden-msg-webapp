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


angular.module('hm', ['dropzone'])
            .controller("MyController", function($scope,  $http) {

                $scope.got_response = false;
                $scope.hide_encode = true;
                $scope.decode_view = false;
                $scope.decode_result = false;

                $scope.Data = {}
                $scope.encode = {};
                $scope.Image = {};
                $scope.dz = {}


                $scope.dropzoneConfig = {
                    'options': {
                        "maxFilesize" : "5",
                        "acceptedFiles" : "image/*",
                        "uploadMultiple" : false,
                        "url": '/img/post',
                        "maxFiles" : 1,
                        init: function(){
                            $scope.dz = this;
                        },
                    },
                    'eventHandlers': {
                        'sending': function (file, xhr, formData) {

                        },
                        'success': function (file, response) {
                            $scope.decode_payload = response
                            $scope.show_decode_result()
                        }
                    }
                };

                $scope.$on('removeFiles', function(event) {
                    $scope.dz.removeAllFiles(true);
                });

                $scope.ValidRegex = function () {
                    if ($scope.Data.payload == undefined)
                        return true

                    if ($scope.Data.payload == "" || $scope.Data.payload.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
                        return true
                };

                $http.get('api?action=image_sources')
                       .then(function(res){
                            console.log(res.data, res.data.images)
                          $scope.images = res.data["images"];
                });

                $scope.show_encode = function() {
                    $scope.got_response = false;
                    $scope.encode_view = true;
                    $scope.decode_view = false;
                    $scope.encode_result_view = false;
                    $scope.decode_result = false;
                }

                $scope.show_decode = function() {
                    $scope.encode_view = false;
                    $scope.decode_view = true;
                    $scope.encode_result_view = false;
                    $scope.decode_result = false;
                    $scope.$broadcast('removeFiles');
                }

                $scope.show_decode_result = function() {
                    $scope.decode_result = true
                    $scope.decode_view = false
                }

                $scope.encode.doClick = function(event) {

                    $http({
                        url: '/api',
                        method: "POST",
                        data: { 'message' : $scope.Data.payload, 'subreddit' : $scope.Image.id}
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




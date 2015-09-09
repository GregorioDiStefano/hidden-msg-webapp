    angular.module("hm", [])
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
                    function(response) { // optional
                            $scope.result = "Failed! :("
                    });
                }
                $scope.Image.update = function(itm){

                }
            } );

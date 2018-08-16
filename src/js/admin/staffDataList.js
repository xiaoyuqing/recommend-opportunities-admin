/**
 * Created by xiaoyq on 2016/9/28.
 */
angular.module('staffDataList', ['ngRoute', 'apiService'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/staffDataList', {
            templateUrl: 'views/staffDataList.html',
            controller: 'staffDataCtr'
        })
    }])
    .controller("staffDataCtr", ["$scope", "$http", "getHttp", function($scope, $http, getHttp) {
        var param = JSON.parse(window.sessionStorage.getItem("user"));
        if (param) {
            $scope.user = param;
        } else {
            return;
        }
        $scope.selected_location = "深圳";
        $scope.location = ["深圳", "广州"];
        $scope.isShow = false;
        $scope.totalData = [];
        $scope.batch = [];

        var locationMap = {
            "深圳": "sz",
            "广州": "gz"
        };

        $scope.selected_position = "直销";
        $scope.position = ["直销", "电销", "KA"];
        var positionMap = {
            "直销": 'zx',
            "电销": 'dx',
            "KA": 'ka'
        };

        $scope.selectDate = function() {
            $scope.isShow = true;
        }

        //关闭弹窗
        $scope.closeDialog = function() {
            $scope.isShow = !$scope.isShow;
        };
        /**
         * 选取完批次之后获取数据
         */
        $scope.submit = function() {
            var url = "/business-recommendation/admin/getPhoneSaleFeedbackInfoList";
            var data = [];
            var count = 0;
            $scope.batch = [];
            getBatch();
            console.log($scope.date);
            if ($scope.date) {
                for (var i = 0; i < $scope.date.length; i++) {
                    data.push({
                        "batchName": $scope.dataDate['selectDate' + i]
                    });
                    $scope.batch.push($scope.dataDate['selectDate' + i]);
                    if ($scope.dataDate['selectDate' + i] == null) {
                        count++;
                    }
                }
                if (count == $scope.date.length) {
                    $('.tip').css('display', 'block');
                    return;
                }

            }
            var dataAth = {
                "nickedName": $scope.user.nickedName,
                "batches": data,
                "location": locationMap[$scope.selected_location]
            }
            getHttp.getHttpData(dataAth, url).success(function(data) {
                if (data.data) {
                    $scope.phoneSell = data.data;
                    $scope.infoList = [];
                    $scope.infoList = $scope.phoneSell.persons;
                }
            })
            $scope.isShow = !$scope.isShow;
        }

        var getUserFeedbackInfoList = function() {
            var url = "/business-recommendation/admin/getUserFeedbackInfoList";
            var data = {
                "name": $scope.user.name,
                "nickedName": $scope.user.nickedName,
                "location": locationMap[$scope.selected_location],
                "type": positionMap[$scope.selected_position]
            };
            getHttp.getHttpData(data, url).success(function(data) {
                $scope.infoList = data.data;
            });
        };
        getUserFeedbackInfoList();
        var getTotalData = function() {
            var url = "/business-recommendation/admin/getSummaryUserFeedback";
            var data = {
                "name": $scope.user.name,
                "nickedName": $scope.user.nickedName,
                "location": locationMap[$scope.selected_location],
                "type": positionMap[$scope.selected_position]
            };
            getHttp.getHttpData(data, url).success(function(data) {
                var tempData = [];
                tempData = data.data;
                $scope.totalData = [];
                if (tempData) {
                    for (var i = 0; i < totalListMap.keySet().length; i++) {
                        $scope.totalData.push({
                            name: totalListMap.keySet()[i],
                            count: tempData[totalListMap.values()[i]]
                        });
                    }
                }
            });
        };
        getTotalData();
        /**
         * 获取批次
         */
        var getBatch = function() {
            var url = "/business-recommendation/admin/batchInfo";
            var data = {
                "name": $scope.user.name,
                "nickedName": $scope.user.nickedName,
                "location": locationMap[$scope.selected_location]
            };
            getHttp.getHttpData(data, url).success(function(data) {
                $scope.date = data.data;
                console.log($scope.date);
            }).then(function() {
                $scope.dataDate = {};
                if ($scope.date) {
                    for (var i = 0; i < $scope.date.length; i++) {
                        $scope.dataDate['selectDate' + i] = null;
                    }
                }
            })
        };
        getBatch();
        /**
         * 选择地区
         */
        $scope.getDataByLocation = function(opt) {
            $scope.selected_location = opt;
            $scope.date = '';
            getBatch();

            if ($scope.selected_position == '电销') {
                $scope.infoList = "";
                $scope.dataDate = {};
                $scope.batch = [];
                var url = "/business-recommendation/admin/getPhoneSaleFeedbackInfoList";
                var data = [];
                if ($scope.date) {
                    data.push($scope.date[$scope.date.length - 1]);
                    $scope.dataDate['selectDate' + ($scope.date.length - 1)] = parseInt($scope.date[$scope.date.length - 1].batchName);
                    $scope.batch.push(parseInt($scope.date[$scope.date.length - 1].batchName));
                }
                var dataAth = {
                    "nickedName": $scope.user.nickedName,
                    "batches": data,
                    "location": locationMap[$scope.selected_location]
                }
                getHttp.getHttpData(dataAth, url).success(function(data) {
                    $scope.phoneSell = data.data;
                    if ($scope.phoneSell) {
                        $scope.infoList = $scope.phoneSell.persons;
                    }
                })
                return;
            }
            getTotalData();
            getUserFeedbackInfoList();
        };


        /**
         * 选择行业
         */
        $scope.getDataByPosition = function(opt) {
            getBatch();
            $scope.selected_position = opt;
            if (opt == '电销') {
                $scope.infoList = "";
                $scope.dataDate = {};
                $scope.batch = [];
                var url = "/business-recommendation/admin/getPhoneSaleFeedbackInfoList";
                var data = [];
                if ($scope.date) {
                    data.push($scope.date[$scope.date.length - 1]);
                    $scope.dataDate['selectDate' + ($scope.date.length - 1)] = parseInt($scope.date[$scope.date.length - 1].batchName);
                    $scope.batch.push(parseInt($scope.date[$scope.date.length - 1].batchName));

                }
                var dataAth = {
                    "nickedName": $scope.user.nickedName,
                    "batches": data,
                    "location": locationMap[$scope.selected_location]
                }
                getHttp.getHttpData(dataAth, url).success(function(data) {
                    $scope.phoneSell = data.data;
                    if ($scope.phoneSell) {
                        $scope.infoList = $scope.phoneSell.persons;
                    }
                })
                return;
            }
            $scope.infoList = "";
            getTotalData();
            getUserFeedbackInfoList();
        };
    }]);
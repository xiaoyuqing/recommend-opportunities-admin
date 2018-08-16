/**
 * Created by xiaoyq on 2016/10/18.
 */
/**
 * Created by xiaoyq on 2016/8/29.
 */

angular.module('getClient', ['apiService'])
    .controller("getClientCtr", ["$scope", "$http", "getHttp", function($scope, $http, getHttp) {
        var para = JSON.parse(window.sessionStorage.getItem("industry"));
        if (!para) {
            var url = '/business-recommendation/app/allocationCompany';
            var data = {};

            //
            getHttp.getHttpData(data, url).success(function(data) {
                $scope.resultData = data.data;
            }).then(function() {
                $scope.chanceData = $scope.resultData;
                for (var i = 0; i < $scope.chanceData.length; i++) {
                    $scope.chanceData[i].companyPhone = $scope.chanceData[i].companyPhone.replace(/\n/ig, "<br/>");
                }
            });
        } else {
            var industry = para.industry;
            var changeUrl = '/business-recommendation/app/reAllocationCompany';
            var data = {
                "industryCategory": industry
            };
            getHttp.getHttpData(data, changeUrl).success(function(data) {
                $("td a.receive").css("display", "inline-block");
                $("td a.tip").css("display", "none");
                $scope.chanceData = data.data;
                for (var i = 0; i < $scope.chanceData.length; i++) {
                    $scope.chanceData[i].companyPhone = $scope.chanceData[i].companyPhone.replace(/\n/ig, "<br/>");
                }
            });
        }


        var changeUrl = '/business-recommendation/app/reAllocationCompany';
        var data = { "industryCategory": industry };
        $scope.changeData = function() {
            getHttp.getHttpData(data, changeUrl).success(function(data) {
                $("td a.receive").css("display", "inline-block");
                $("td a.tip").css("display", "none");
                $scope.chanceData = data.data;
                for (var i = 0; i < $scope.chanceData.length; i++) {
                    $scope.chanceData[i].companyPhone = $scope.chanceData[i].companyPhone.replace(/\n/ig, "<br/>");
                }
            });
        };

        $scope.getCompanyDetail = function(id) {
            var parameter = id;
            if (window.sessionStorage) {
                window.sessionStorage.setItem("companyId", JSON.stringify(parameter));
            } else {
                alert("您的浏览器不支持sessionStorage，请换用最新谷歌浏览器！");
            }
            window.location.href = "#/companyDetail";
        }

        var situationUrl = '/business-recommendation/app/updateCompanyListFeedback';
        $scope.receive = function(id) {
            var receiveData = {
                "recommendationResultId": id,
                "isRefuse": "0"
            };
            getHttp.getHttpData(receiveData, situationUrl).success(function(data) {
                $("#receive" + id).css("display", "none");
                $("#tip" + id).css("display", "inline-block");
            });
        };
    }]);
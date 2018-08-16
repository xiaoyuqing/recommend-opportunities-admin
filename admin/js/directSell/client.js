/**
 * Created by xiaoyq on 2016/10/18.
 */
- +
/**
 * Created by xiaoyq on 2016/8/29.
 */
angular.module('client', ['apiService'])
    .controller("clientCtr", ["$scope", "$http", "getHttp", function($scope, $http, getHttp) {
        var url = '/business-recommendation/app/userCompanyList';
        var data = {

        };
        //获取客户资源列表
        getHttp.getHttpData(data, url).success(function(data) {
            $scope.resultData = data.data;
        }).then(function() {
            $scope.resourceData = $scope.resultData;
            if ($scope.resourceData) {
                $scope.currentData = $scope.resourceData.acceptedCompanyListNow;
            }
        });

        $scope.getCompanyDetail = function(id, intent, invite, niRemark) {
            $scope.parameter = {
                id: id,
                intent: intent,
                invite: invite,
                niRemark: niRemark
            };
            if (window.sessionStorage) {
                window.sessionStorage.setItem("myCompanyId", JSON.stringify($scope.parameter));
            } else {
                alert("您的浏览器不支持sessionStorage，请换用最新谷歌浏览器！");
            }
            window.location.href = "#/myCompanyDetail";
        };

        $scope.getSofar = function() {
            $scope.currentData = $scope.resourceData.acceptedCompanyListNow;
            $(".sofar").css("color", "#3487e2").siblings().css("color", "#000");
        };
        $scope.getHistory = function() {
            $scope.currentData = $scope.resourceData.acceptedCompanyListOld;
            $(".history").css("color", "#3487e2").siblings().css("color", "#000");

        };

    }]);
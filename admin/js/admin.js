/**
 * Created by xiaoyq on 2016/10/13.
 */
var loginApp = angular.module("loginApp", ['ngRoute', 'apiService']);
loginApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'admin.html',
            controller: 'loginCtr'
        })
        .otherwise({
            redirectTo: '/login'
        })
}]);


loginApp.controller('loginCtr', ["$scope", "$location", "getHttp", function($scope, $location, getHttp) {
    var param = JSON.parse(window.sessionStorage.getItem("user"));
    if (!param) {
        var url = '/business-recommendation/admin/getUserRoleInfo';
        var data = "";
        getHttp.getHttpData(data, url).success(function(data) {
            $scope.user = data.data;
            if (window.sessionStorage) {
                window.sessionStorage.setItem("user", JSON.stringify($scope.user));
            } else {
                alert("您的浏览器不支持sessionStorage，请换用最新谷歌浏览器！");
            }
        });
        return;
    }
    $scope.user = param;
}]);
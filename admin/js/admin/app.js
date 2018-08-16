/**
 * Created by xiaoyq on 2016/9/27.
 */
var t = location.protocol + "//" + location.host + "//";
var adminApp = angular.module("adminApp", ['ngRoute', 'staffList', 'staffDataList', "companyDetail", "apiService"]);
adminApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when('/staff', {
            templateUrl: 'views/admin/staff.html',
            controller: 'staffCtr'
        })
        .when('/staffDataList', {
            templateUrl: 'views/admin/staffDataList.html',
            controller: 'staffDataCtr'
        })
        .when('/companyDetail', {
            templateUrl: 'views/admin/companyDetail.html',
            controller: 'companyDetailCtr'
        })
        .otherwise({
            redirectTo: '/staffDataList'
        })
}]);


adminApp.controller('NavCtr', ["$scope", "$location", "getHttp", function($scope, $location, getHttp) {
    $scope.isCur = function(route) {
        return route == $location.path();
    };
    var param = JSON.parse(window.sessionStorage.getItem("user"));
    if (param) {
        $scope.user = param;
        window.sessionStorage.setItem("role", $scope.user.role);
    }
}]);

adminApp.directive("dropdown", ['$compile', '$rootScope', function($compile, $rootScope) {
    return {
        restrict: 'EA',
        require: ['?ngModel'],
        scope: {
            items: '=dropdownData',
            preselectedItem: '=',
            changefn: '='
        },
        templateUrl: 'views/directives/dropdown.html',
        link: function(scope) {
            scope.dropdownShow = true;
            scope.dropdownHandle = function() {
                scope.dropdownShow = !scope.dropdownShow;
            };
            scope.selectVal = function(item, event) {
                if (event != undefined) {
                    event.stopPropagation();
                    scope.changefn(item)
                }
                scope.dropdownShow = !scope.dropdownShow;

            };
            scope.selectVal();
        }
    };
}]);
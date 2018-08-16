/**
 * Created by xiaoyq on 2016/10/18.
 */
/**
 * Created by xiaoyq on 2016/9/27.
 */

var directApp = angular.module("directApp", ['ngRoute', "apiService", "getClient", "client", "myCompanyDetail"]);
directApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when('/getClient', {
            templateUrl: 'views/directSell/getClient.html',
            controller: 'getClientCtr'
        })
        .when('/client', {
            templateUrl: 'views/directSell/client.html',
            controller: 'clientCtr'
        })
        .when('/myCompanyDetail', {
            templateUrl: 'views/directSell/myCompanyDetail.html',
            controller: 'myCompanyDetailCtr',
            controllerAs: 'companyCtrl'
        })
        .otherwise({
            redirectTo: '/getClient'
        })
}]);


directApp.controller('NavCtr', ["$scope", "$location", "getHttp", function($scope, $location, getHttp) {
    $scope.industryShow = false;
    var para = JSON.parse(window.sessionStorage.getItem("industry"));
    if (para) {
        $scope.curIndustry = para.industry;
        $scope.industryShow = para.show;
    }
    $scope.isCur = function(route) {
        return route == $location.path();
    };

    if ($location.path() == '/myCompanyDetail') {
        $(".selectedClient").addClass("cur");
    }

    var url = '/business-recommendation/app/getIndustryCategory';
    var data = {};

    //
    getHttp.getHttpData(data, url).success(function(data) {
        $scope.category = data.data;
    });

    $scope.chooseIndustry = function() {
        $scope.industryShow = !$scope.industryShow;
    };

    $scope.closeIndustry = function() {
        $scope.industryShow = false;
    }


    $scope.getIndustryData = function(item) {
        var parameter = {
            industry: item,
            show: $scope.industryShow
        };
        $('.industry').css('display', 'block');
        if (window.sessionStorage) {
            window.sessionStorage.setItem("industry", JSON.stringify(parameter));
        } else {
            alert("您的浏览器不支持sessionStorage，请换用最新谷歌浏览器！");
        }
        $(window).scrollTop(0);
        window.location.reload();
        $scope.industryShow = true;
    };
}]);


directApp.directive("dropdown", ['$compile', '$rootScope', function($compile, $rootScope) {
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
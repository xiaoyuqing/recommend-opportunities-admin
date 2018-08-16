/**
 * Created by xiaoyq on 2016/10/10.
 */
angular.module('companyDetail', ['ngRoute', 'apiService', 'ngSanitize'])
    .config(['$routeProvider', function($routeProvider) {}])
    .controller("companyDetailCtr", ["$scope", "$http", "getHttp", "$sce", function($scope, $http, getHttp, $sce) {
        var param = JSON.parse(window.sessionStorage.getItem("user"));
        if (!param) {
            return;
        }
        $scope.user = param;
        var pageNums = 5;
        var totalNum = 0;

        $scope.currentPage = 1;
        $scope.selected_position = "直销";
        $scope.position = ["直销", "KA"];
        var positionMap = {
            "直销": 'zx',
            "电销": 'dx',
            "KA": 'ka'
        };
        $scope.selected_intent = "所有";
        $scope.intent = ["所有", "有意向", "无意向"];
        $scope.totalData = [];

        var intentMap = {
            "所有": "-1",
            "有意向": "1",
            "无意向": "0"
        };

        $scope.selected_invited = "所有";
        $scope.invited = ["所有", "邀约成功", "邀约不成功"];
        var invitedMap = {
            "所有": '-1',
            "邀约成功": '1',
            "邀约不成功": '0'
        };
        $scope.selected_remark = "所有";
        $scope.remark = ["所有", "有备注", "无备注"];
        var reamrkMap = {
            "所有": '-1',
            "有备注": '1',
            "无备注": '0'
        };
        $scope.selected_location = "深圳";
        $scope.location = ["深圳", "广州"];
        var locationMap = {
            "深圳": 'sz',
            "广州": 'gz'

        };
        var paging = function(currentPage) {
            $scope.currentPage = Number(currentPage);
            var startPage = (currentPage - 1) * pageNums;
            var endPage = currentPage * pageNums > totalNum ? totalNum : currentPage * pageNums;
            $scope.pageData = $scope.companyData.slice(startPage, endPage);
        };

        var getCompanyList = function() {
            var url = "/business-recommendation/admin/getUserAcceptedCompanyInfo";
            var data = {
                "name": $scope.user.name,
                "nickedName": $scope.user.nickedName,
                "dataType": positionMap[$scope.selected_position],
                "intent": intentMap[$scope.selected_intent],
                "invited": invitedMap[$scope.selected_invited],
                "remark": reamrkMap[$scope.selected_remark],
                "location": locationMap[$scope.selected_location]
            };
            getHttp.getHttpData(data, url).success(function(data) {
                $scope.companyData = data.data;
                for (var i = 0; i < $scope.companyData.length; i++) {
                    $scope.companyData[i].companyPhone = $scope.companyData[i].companyPhone.replace(/\n/ig, "<br/>");
                }
                totalNum = $scope.companyData.length; //表格总条数
                $scope.inputNum = "";
                if (totalNum % pageNums == 0) {
                    $scope.pages = totalNum / pageNums;
                } else {
                    $scope.pages = Math.ceil(totalNum / pageNums);
                }
                paging($scope.currentPage);
            });
        };
        getCompanyList();


        /**
         * 前一页点击事件
         */
        $scope.getPrePage = function() {
            if ($scope.currentPage == 1) {
                alert("已经是第一页了！");
            } else {
                $scope.currentPage = $scope.currentPage - 1;
                paging($scope.currentPage);
            }
        };
        /**
         * 后一页点击事件
         */
        $scope.getNextPage = function() {
            if ($scope.currentPage == $scope.pages) {
                alert("已经是最后一页了！");
            } else {
                $scope.currentPage = $scope.currentPage + 1;
                paging($scope.currentPage);
            }
        };
        /**
         * 根据输入框页码获取指定页面
         */
        $scope.getPageByInputNum = function() {
            if ($scope.inputNum < 1) {
                alert("输入页码不能小于1，请重新输入！");
            }
            if ($scope.inputNum > $scope.pages) {
                alert("输入页码不能大于总页数，请重新输入！");
            }
            if ($scope.inputNum >= 1 && $scope.inputNum <= $scope.pages) {
                paging($scope.inputNum);
            }
            $scope.inputNum = "";
        };

        $scope.getDataByPosition = function(opt) {
            $scope.selected_position = opt;
            $scope.currentPage = 1;
            getCompanyList();
        };

        $scope.getDataByIntent = function(opt) {
            $scope.currentPage = 1;
            $scope.selected_intent = opt;
            getCompanyList();
        };
        $scope.getDataByInvited = function(opt) {
            $scope.currentPage = 1;
            $scope.selected_invited = opt;
            getCompanyList();
        };
        $scope.getDataByRemark = function(opt) {
            $scope.currentPage = 1;
            $scope.selected_remark = opt;
            getCompanyList();
        };
        $scope.getDataByLocation = function(opt) {
            $scope.currentPage = 1;
            $scope.selected_location = opt;
            getCompanyList();
        };
    }]);
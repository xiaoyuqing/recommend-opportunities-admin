/**
 * Created by xiaoyq on 2016/9/27.
 */
angular.module('staffList', ['ngRoute', 'apiService'])
    .config(['$routeProvider', function($routeProvider) {

    }])
    .controller("staffCtr", ["$scope", "$http", "getHttp", function($scope, $http, getHttp) {
        //关闭弹窗
        $scope.closeDialog = function() {
            $scope.isShow = !$scope.isShow;
        };
        //员工信息
        $scope.member = {
            name: "",
            superior: "",
            role: "",
            location: "",
            type: ""
        };
        var staffUrl = '/business-recommendation/admin/getAllUserRoleInfo';
        var staffData = "";
        getHttp.getHttpData(staffData, staffUrl).success(function(data) {
            $scope.staffList = data.data;
        });

        var addUserRoleInfo = function() {
            var url = "/business-recommendation/admin/addUserRoleInfo";
            var data = {
                "name": $scope.member.name,
                "superior": $scope.member.superior,
                "role": $scope.member.role,
                "location": $scope.member.location,
                "type": $scope.member.type
            };
            getHttp.getHttpData(data, url).success(function(data) {});
        };
        $scope.staff_form = {};
        $scope.staff_form.submitted = false;
        $scope.addStaff = function(isAdd) {
            $scope.member = {};
            $scope.staff_form.submitted = false;
            $scope.isAdd = isAdd;
            $scope.isShow = true;
        };
        //删除员工信息
        $scope.deleteStaff = function(index) {
            var dataDelete = {
                "name": $scope.staffList[index].name
            };
            var urlDelete = '/business-recommendation/admin/deleteUserRoleInfo';
            getHttp.getHttpData(dataDelete, urlDelete).success(function(data) {});
            $scope.staffList.splice(index, 1);
        };
        //编辑员工信息
        $scope.editStaff = function(index, isAdd) {
            $scope.staff_form.submitted = false;
            $scope.isAdd = isAdd;
            $('.modal-header h1 span').text('编辑员工');
            $scope.isShow = true;
            $scope.temp = angular.extend({}, $scope.staffList[index]);
            $scope.member = $scope.staffList[index];
            addUserRoleInfo();
        };
        //提交表单
        $scope.submitForm = function() {
            if ($scope.staffForm.$valid) {
                addUserRoleInfo();
                if ($scope.isAdd) {
                    $scope.staffList.unshift($scope.member);
                }
                $scope.isShow = !$scope.isShow;
            } else {
                $scope.staff_form.submitted = true;
            }
        }
    }])
    .directive('ngFocus', [function() {
        var FOCUS_CLASS = "ng-focused";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                ctrl.$focused = true;
                element.bind('focus', function(evt) {
                    element.addClass(FOCUS_CLASS);
                    scope.$apply(function() { ctrl.$focused = true; });
                }).bind('blur', function(evt) {
                    element.removeClass(FOCUS_CLASS);
                    scope.$apply(function() { ctrl.$focused = false; });
                });
            }
        }
    }]);
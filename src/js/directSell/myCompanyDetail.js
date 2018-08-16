/**
 * Created by xiaoyq on 2016/8/30.
 */
angular.module('myCompanyDetail', ['ngRoute', 'ngSanitize', 'apiService'])
    .controller("myCompanyDetailCtr", ["$scope", "$http", "getHttp", "$sce", function($scope, $http, getHttp) {
        var parameter = JSON.parse(window.sessionStorage.getItem("myCompanyId"));
        var resultId = parameter.id;
        var intention = parameter.intent;
        var invite = parameter.invite;
        var niRemark = parameter.niRemark;
        var _self = this;

        /**
         * 反馈
         */
        var submitState = function() {
            if (intention != -1 && invite != -1) {
                $(".beforeSubmit").css("display", "none");
                $(".submited").css("display", "block");
            }
        };
        submitState();

        var url = '/business-recommendation/app/companyDetail';
        var data = {
            "recommendationResultId": resultId
        };

        getHttp.getHttpData(data, url).success(function(data) {
            $scope.resultData = data.data;
        }).then(function() {
            $scope.companyData = $scope.resultData;
            $scope.companyData.companyPhone = $scope.companyData.companyPhone.replace(/\n/ig, "<br/>");
        });

        this.feedbackData = {
            intent: intention,
            invited: invite,
            recommendationResultId: resultId,
            niRemark: niRemark
        };

        var feedbackUrl = "/business-recommendation/app/updateCompanyFeedback";
        $scope.submit = function() {
            getHttp.getHttpData(_self.feedbackData, feedbackUrl);
            $(".submit").text("已提交");
            parameter.niRemark = _self.feedbackData.niRemark;          
            if (window.sessionStorage) {
                window.sessionStorage.setItem("myCompanyId", JSON.stringify(parameter));
            } else {
                alert("您的浏览器不支持sessionStorage，请换用最新谷歌浏览器！");
            }
        };

        $scope.correct = function() {
            $scope.correctText = $scope.companyData.companyPhone.replace(/<br\/>/ig, "\n");
            $(".correct").css("display", "none");
            $(".confirm").css("display", "inline-block");
            $(".correction").css("display", "block");

        };
        $scope.confirm = function() {
            $scope.correctText = $.trim($scope.correctText);
            $(".correct").css("display", "inline-block");
            $(".confirm").css("display", "none");
            $(".correction").css("display", "none");
            var correctData = {
                "recommendationResultId": resultId,
                "phone": $scope.correctText
            };
            var correctUrl = "/business-recommendation/app/editCompanyInfo";
            if ($scope.correctText != "") {
                getHttp.getHttpData(correctData, correctUrl).success(function(data) {
                    if (data.errCode == 0) {
                        $scope.companyData.companyPhone = $scope.correctText.replace(/\n/ig, "<br/>");
                    }
                });
            }
        };
    }]);
/**
 * Created by xiaoyq on 2016/9/28.
 */
//��������
angular.module("apiService",[]).service("getHttp",["$http",function($http){
   this.getHttpData = function(urlData,url){
        return $http({
            method:'POST',
            data:urlData,
            url:url
        });
    };
}]);
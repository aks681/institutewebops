angular.module('userApp',['appRoutes','userControllers','userServices','mainController','authServices','fileModelDirective'])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors'); //intercepts all http request and attaches token header

});

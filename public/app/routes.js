var app = angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider){
  $routeProvider.when('/',{
    templateUrl: 'app/views/pages/home.html'
  })
  .when('/register',{
    templateUrl: 'app/views/pages/user/signup.html',
    controller: 'regCtrl',
    controllerAs: 'register',
    authenticated: false
  })
  .when('/login',{
    templateUrl:'app/views/pages/user/login.html',
    authenticated: false
  })
  .when('/logout',{
    templateUrl:'app/views/pages/user/logout.html',
    authenticated: true
  })
  .when('/profile',{
    templateUrl:'app/views/pages/user/dashboard.html',
    authenticated: true
  })
  .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
  });
});

app.run(['$rootScope', 'User','Auth', '$location',function($rootScope,User,Auth,$location){

  $rootScope.$on('$routeChangeStart',function(event,next,current){

    if(next.$$route !== undefined){
      if(next.$$route.authenticated === true){
        if(!Auth.isLoggedIn()){
          event.preventDefault();
          $location.path('/');
        }
      }
      else if(next.$$route.authenticated === false){
        if(Auth.isLoggedIn()){
          event.preventDefault();
          $location.path('/profile');
        }
      }
    }
  });
}]);

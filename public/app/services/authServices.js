angular.module('authServices',[])
.factory('Auth',function($http,AuthToken){
  var authfactory = [];
//  User.create(loginData);
  authfactory.login=function(loginData){
    return  $http.post('/api/authenticate',loginData).then(function(data){
      AuthToken.setToken(data.data.token);
      return data;
    });
  };


    authfactory.isLoggedIn=function(){
      if(AuthToken.getToken())
      {
        return true;
      }
      else {
        return false;
      }
    };

    authfactory.getUser=function(){
      if(AuthToken.getToken()){
        return $http.post('/api/current');
      }
      else {
        $q.reject({message:'User has no token'});
      }
    };
    authfactory.logout=function(){
     AuthToken.setToken();
    };
  return authfactory;
})
.factory('AuthToken', function($window){
  var authTokenfactory=[];
  authTokenfactory.setToken=function(token){
    if(token){
    $window.localStorage.setItem('token',token);
  }
  else{
    $window.localStorage.removeItem('token');
  }
  };
  authTokenfactory.getToken=function(token){
    return $window.localStorage.getItem('token');
  };
  return authTokenfactory;
})

.factory('AuthInterceptors',function(AuthToken){
  var authInterceptorsFactory=[];
  authInterceptorsFactory.request=function(config){
    var token=AuthToken.getToken();
    if(token)
    {
      config.headers['x-access-token'] = token;
    }
    return config;
  };
  return authInterceptorsFactory;
});

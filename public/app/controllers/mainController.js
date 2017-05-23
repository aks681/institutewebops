angular.module('mainController',['authServices','userServices','fileModelDirective'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$scope,User){
  var app=this;
app.loadme=false;
  $rootScope.$on('$routeChangeStart',function(){

    if(Auth.isLoggedIn()){
      app.isLoggedIn=true;
      Auth.getUser().then(function(data){
        app.username=data.data.username;
        app.name=data.data.name;
        app.id=data.data.id;
        app.address=data.data.address;
        app.hobbies=data.data.hobbies;
        app.gender=data.data.gender;
        app.email=data.data.email;
       app.loadme=true;
      });
    }
    else{
      app.isLoggedIn=false;
      app.username=null;
      app.loadme=true;
    }
  });

  $scope.file = {};
  $scope.Submit = function(){
    $scope.uploading = true;
    User.upload($scope.file).then(function(data){
      if(data.data.success){
        $scope.uploading=false;
        app.success=data.data.message;
        console.log(data.data.path);
        User.setimage(data.data.path).then(function(data){
         console.lof(data.data);
        });
        $scope.file={};
      }else {
        $scope.uploading=false;
        app.error=data.data.message;
        $scope.file={};
      }
    });
  };

   this.doLogin=function(loginData){
     app.loading=true;
     app.errorMsg=false;
     Auth.login(app.loginData).then(function(data){
       if(data.data.success)
       {
         app.loading=false;
         app.successMsg=data.data.message + '...redirecting to profile page';

         $timeout(function(){
           $location.path('/profile');
         app.loginData=null;
         app.successMsg=false;
       },1000);

       }
       else {
         app.loading=false;
         app.errorMsg=data.data.message;
         if(data.data.redirect){
         $timeout(function(){
           $location.path('/register');
         app.loginData=null;
         app.successMsg=false;
       },1000);
     }
       }
     });

};
this.logout=function(){
  Auth.logout();
  $location.path('/logout');
  $timeout(function(){
    $location.path('/home');
  },1000);
};
});

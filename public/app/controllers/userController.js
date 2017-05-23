angular.module("userControllers",['userServices'])
.controller('regCtrl',function($http,$location,$timeout,User,$scope){
  var app=this;
  app.male=null;
  app.female=null;
   this.regUser=function(regData){
     app.loading=true;
     app.errorMsg=false;
     if(app.male)
      {
         this.regData.gender="male";
     }
     else if(app.female)
     {
       this.regData.gender="female";
     }
     User.create(app.regData).then(function(data){
       if(data.data.success)
       {
         app.loading=false;
         app.successMsg=data.data.message + '...Redirecting to Dashboard';
         $timeout(function(){
         $location.path('/profile');
         },2000);

       }
       else {
         app.loading=false;
         app.errorMsg=data.data.message;
       }
     });
   };
});

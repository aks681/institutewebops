angular.module('fileModelDirective',[])
//directive to parse the filename and update the scope with this parsed file
.directive('fileModel',['$parse',function($parse){
  return{
    restrict: 'A', //restricting to attributes only
    link: function(scope,element,attrs){
      var parsedFile=$parse(attrs.fileModel);   //parsing done here
      var parsedFileSetter=parsedFile.assign;
      element.bind('change',function(){        //Watch the bound element for changes and updates the scope with this parsed file whre file-model was mentioned
        scope.$apply(function(){
          parsedFileSetter(scope,element[0].files[0]);
        });
      });
    }
  };
}]);

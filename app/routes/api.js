var User=require('../models/user');
var jwt=require('jsonwebtoken');
var fs = require('fs');
var secret = 'awesome';

//router= export all accessing done to server
module.exports = function(router){
  router.post('/users',function(req,res){
   var user = new User();
   user.username = req.body.username;
   user.address=req.body.address;
   user.hobbies=req.body.hobbies;
   user.gender=req.body.gender;
   user.password = req.body.password;
   user.email = req.body.email;
   user.name = req.body.name;
   if(req.body.username==null||req.body.username==''){
     res.json({success: false,message:"Username field is empty"});
   }
 else if(req.body.password==null||req.body.password==''){
   res.json({success: false,message:"Password field is empty"});
 }
 else if(req.body.name==null||req.body.name==''){
   res.json({success: false,message:"Name field is empty"});
 }
 else if(req.body.email==null||req.body.email==''){
   res.json({success: false,message:"Email field is empty"});
 }
   else{
   user.save(function(err){
     if(err){
     if(err.code === 11000){
     res.json({success: false,message:"Username or email already exists"});
      }
      else if(err.errors.email){
        res.json({success: false, message: err.errors.email.message});
      }
      else if(err.errors.name){
        res.json({success: false, message: err.errors.name.message});
      }
      else if(err.errors.username){
        res.json({success: false, message: err.errors.username.message});
      }
      else if(err.errors.password){
        res.json({success: false, message: err.errors.password.message});
      }
   }
     else {
       var token = jwt.sign({id: user._id, name: user.name, username: user.username, email: user.email, address: user.address, gender: user.gender, hobbies: user.hobbies},secret,{expiresIn:'24h'});
       res.json({success: true,message:"You Are Now Registered", token: token});
     }
   });
 }
 });

 router.post('/authenticate',function(req,res){
   User.findOne({username: req.body.username}).select('_id email username password address gender hobbies name').exec(function(err,user){
     if(err)
      throw err;
      if(!user){
        res.json({success: false, message: "User Not Found", redirect: true});
      } else if(user)
      {
        if(req.body.password){
        var validPassword = user.comparePassword(req.body.password);
        if(!validPassword){
          res.json({success: false, message :"Password Incorrect"});
        }
        else{
          var token = jwt.sign({id: user._id, name: user.name, username: user.username, email: user.email, address: user.address, gender: user.gender, hobbies: user.hobbies},secret,{expiresIn:'24h'});
          res.json({success: true, message: "Successfully Logged In", token: token});
        }
      }
      else {
        res.json({success: false, message :"No Password provided"});
      }
      }
   });
 });

 router.use(function(req,res,next){
   var token=req.body.token||req.body.query||req.headers['x-access-token'];
   if(token)
   {
     jwt.verify(token,secret,function(err,decoded){
       if(err)
       {
         res.json({success: false, message: "User Session Expired Invalid token"});
       }
       else {
         req.decoded= decoded;
         next();
       }
     });
   }
   else{
     res.json({success: false, message: "No User Available"});
   }
 });
 router.post('/current',function(req,res){
   res.send(req.decoded);
 });

 router.put('/uploadurl',function(req,res){

 console.log(req);
   User.findOne({username: req.decoded.username},function(err, user){
     if(err) throw err;
     if(!user){
       console.log("No user");
     }
     else {
       user.gallery = req.body;
      user.save(function(err){
         if(err) throw err;
         res.json({success: true, message: "User updated"});
       });
     }
   });
 });

  return router;
};

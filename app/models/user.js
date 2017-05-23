var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{1,20})+[ ]+([a-zA-Z]{1,20})+)+$/,
    message: 'There should be a first name and a surname with no special characters or numbers '
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Not a Valid Email'
  }),
  validate({
    validator: 'isLength',
    arguments: [3,30],
    message: 'Email length should be between 3 and 30 characters'
  })
];

var userValidator = [
  validate({
    validator: 'isLength',
    arguments: [3,30],
    message: 'Username length should be between 3 and 30 characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username must contain letters and numbers only'
  })
];

var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [8,35],
    message: 'Password length should be between 8 and 35 characters'
  }),
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\w]).{8,30}$/,
    message: 'The password must contain small and caps letters, numbers and special symbols'
  })
];

var userSchema = new Schema({
  name: {type: String, required: true, validate: nameValidator},
  username: {type: String, required: true, validate: userValidator},
  address: {type: String, required: true},
  password: {type: String, required : true, select: false, validate: passwordValidator},
  email: {type: String, required: true, unique: true, validate: emailValidator},
  hobbies: {type: String},
  gallery: {type: String },
  gender: {type: String, required: true}
});

userSchema.pre('save',function(next){
var user=this;
if(!user.isModified('password'))
 return next();
  bcrypt.hash(user.password,null,null,function(err,hash){
   if(err)
    return next(err);
    user.password=hash;
    next();
  });

});

userSchema.plugin(titlize,{
  paths: ['name']
});

userSchema.methods.comparePassword=function(password){
  return bcrypt.compareSync(password,this.password);
};

 module.exports = mongoose.model('User',userSchema);

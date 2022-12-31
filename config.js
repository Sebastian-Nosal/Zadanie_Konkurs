const passwordValidator = require('password-validator');
const passwordschema = new passwordValidator();

passwordschema.is().min(8).is().max(32).has().uppercase().has().lowercase().has().digits().has().not().spaces().has().symbols(); 

const emailValidator = require("email-validator");

const sha256= require("crypto-js");
const secretKey = process.env.hashSecret ||"Q@sf4yhbdfgu46dxre635243@rfesd43FGDS@#RFt42g4"

hashPassword = (password) =>  {return sha256.HmacSHA256(password, secretKey).toString()}

module.exports = {
    passwordSchema : passwordschema,
    emailSchema : emailValidator,
    hash: hashPassword
    
}
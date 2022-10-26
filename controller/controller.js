/* eslint-disable no-trailing-spaces */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
class Controller {
  
  #sha256= require("crypto-js");
  #secretKey = process.env.hashSecret ||"Q@sf4yhbdfgu46dxre635243@rfesd43FGDS@#RFt42g4"
  emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  passwordPattern = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/;

  #handleAsync() {

  }

  #hashPassword(password) {
    
    let hashedPassword = this.#sha256.HmacSHA256(password, this.#secretKey)
    console.log(hashedPassword)
    return hashedPassword
  }

  // Co-work with another controller-

  renderMainPage(req, res) {
    if (typeof req.session.logged !== 'undefined') {
      if (req.session.logged.type === 'student') res.render('student');
      else res.render('teacher');
    } 
    else res.render('index', { title: 'Main Page' });
  }

  renderLoginPage(req, res) {
    if (req.session.logged) res.redirect('/');
    else res.render('login', { loginStatus: null });
  }

  renderRegisterPage(req, res) {
    if (req.session.logged) res.redirect('/');
    else res.render('register');
  }

  handleLogin(req, res) {
    if (req.body.username && req.body.password) {
      if(req.body.password.match(this.passwordPattern)&&req.body.username.match(this.emailPattern))
      {
        res.status(200).send('all ok now')
      }
      else
      {
        res.status(400).send('Invalid credentials');
      }
    }
    else
    {
      res.status(400).send('Missing data')
    }
  }

  handleRegister(req, res) {

  }
}

module.exports = new Controller();

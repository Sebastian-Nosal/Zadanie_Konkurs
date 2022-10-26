/* eslint-disable no-trailing-spaces */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */

const {emailSchema, passwordSchema, hash} = require("../config");
const userModel = require('../model/users');


class Controller {
  

  handleAsync() {

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

  async handleLogin(req, res) {
    if (req.body.username && req.body.password) {
     
      const {username, password} = req.body;
      console.log(passwordSchema.validate(password)&&emailSchema.validate(username))
      if(passwordSchema.validate(password)&&emailSchema.validate(username))
      {
        const hashedPassword = hash(password);
        console.log(hashedPassword)
        if(userModel.checkIfUserIsInDb(username))
        {
          if(userModel.checkCredentials(username,hashedPassword)) res.status(200).send('all ok now')
          else res.status(400).send('Incorrect email or password')
        }
        else res.status(400).send('Not such user in database. Register first')
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

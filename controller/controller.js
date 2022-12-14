const {emailSchema, passwordSchema, hash} = require("../config");
const userModel = require('../model/users');
const apiController = require('./api_controller');

class Controller   
{
  constructor()
  {
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.renderLoginPage = this.renderLoginPage.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.renderRegisterPage = this.renderRegisterPage.bind(this);
  }

  renderMainPage(req, res) {
    if (typeof req.session.account !== 'undefined') {
      if (req.session.account.type === 'student') res.render('student');
      else if(req.session.account.type==='teacher')res.render('teacher');
      else res.render('index', { title: 'Main Page' })
    } 
    else res.redirect('/login');
  }

  renderLoginPage(req, res) {
    if (req.session.account) res.redirect('/');
    else res.render('login', { loginStatus: null });
  }

  renderRegisterPage(req, res) {
    if (req.session.account) res.redirect('/');
    else res.render('register');
  }

 async handleLogin(req, res) {
    if (req.body.username && req.body.password) {
      const {username, password} = req.body;
      if(passwordSchema.validate(password)&&emailSchema.validate(username))
      {
        const hashedPassword = hash(password);
        if(userModel.checkIfUserIsInDb(username))
        {
          if(userModel.checkCredentials(username,hashedPassword)) 
          {
            const {type} = await userModel.getUserByUsername(username);
            if(type) 
            {
              req.session.cookie.maxAge = 3600000;
              req.session.account = {username: username, type: type }
              const token = await apiController.auth(username,type);
              res.cookie('token', token, {sameSite: true});
              res.redirect('/');
            }
            else
            { 
              res.status(500).send('Internal problem with database. Please try to log in again later')
            }
          }
          else res.status(400).send('Incorrect email or password')
        }
        else res.status(400).send('Not such user in database. Register first')
      }
      else res.status(400).send('Invalid credentials');
    } 
    else res.status(400).send('Missing data')
  }

  async handleRegister(req, res) {
    const {username, password, type} = req.body;
    if(username&&password&&type)
    {
      if(emailSchema.validate(username)&&passwordSchema.validate(password)&&(type==='student'||type==='teacher'))
      {
        if(await userModel.checkIfUserIsInDb(username)===false)
        {
          const hashedPassword = hash(password)
          if(await userModel.insertUser(username,hashedPassword,type))
          {
            res.status(201).redirect('/login');
          } 
          else res.status(500).send('Problem with database');
        }
        else res.status(400).send('user Already Exist');
      }
      else res.status(400).send('Invalid email or password')
    }
    else res.status(400).send('Missing data')
  }
}

module.exports = Controller.prototype;

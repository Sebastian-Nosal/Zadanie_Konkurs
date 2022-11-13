const jwt = require('jsonwebtoken');
const { hash, emailSchema, passwordSchema } = require('../config');
const userModel = require('../model/users')
const questionModel = require('../model/questions');
const groupModel = require('../model/groups')
const examModel = require('../model/exams')
const answerModel = require('../model/answers');
const { query } = require('express');
const JWTSECRET = process.env.JWTSECRET || "iufghvkledsrkgl;'erfhkloegkledtjhnlvbpryhnkgl;nml;t'thl;hlbl;fp[6yryg,rtfd;'h,rt;'hb,l;l;gbrthledt'kjrtjlk,t;'jhlrp[yfjkh[]re";

class apiController
{

    constructor()
    {
        this.isAuth = this.isAuth.bind(this);
        this.auth = this.auth.bind(this);
        this.getMe = this.getMe.bind(this);
        this.getUser = this.getUser.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.insertUser = this.insertUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.insertQuestion = this.insertQuestion.bind(this);
        this.insertGroup = this.insertGroup.bind(this);
        this.getGroup = this.getGroup.bind(this);
        this.getExam = this.getExam.bind(this);
        this.getExams = this.getExams.bind(this)
        this.insertExam = this.insertExam.bind(this);
        this.inserAnswer = this.insertAnswer.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
    }

    allowCors(req,res,next)
    {
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        next();
    }

    docs (req,res,next)
    {
        res.render('docs')
    }

    auth(username,type)
    {
        console.log(Date.now())
        return jwt.sign({ username:username, type: type}, JWTSECRET, {expiresIn: '3600s'})
    }

    unAuth(req)
    {
         req.body.token=null; 
         req.query.token=null; 
         req.headers["x-access-token"]=null;
    }

    async isAuth(req)
    {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        //console.log(token)
        if(!token)
        {
            return {code: 403, comment: 'any token send'}
        }
        //console.log(token)
        try
        {
            const decoded = Object.assign({code: 200, comment:'ok'},jwt.verify(token, JWTSECRET));
            //console.log(decoded);
            return(decoded);
        }
        catch(err)
        {
            console.log(err);
            return {code: 401, comment: 'Invalid token'}
    
        }

    }

    async handleAuth(req,res)
    {
        const {username, password} = req.body;
        if(username&&password)
        {
            const hashedPassword = hash(password);
            console.log(username,hashedPassword)
            if(await userModel.checkCredentials(username,hashedPassword))
            {
                const result = await userModel.getUserByUsername(username);
                const token = this.auth(username,result.type);
                res.status(200).json(token);
            }
            else res.status(400).send('not such user');
        }
        else res.status(400).send('missing data');
    }

    async getMe(req,res)
    {
        console.log('xxx')
        const user = await this.isAuth(req);
        console.log(user);
        if(user.code===200)
        {
            try{
                const result = await userModel.getUserByUsername(user.username);
                console.log(result);
                res.status(200).json(result);
            }
            catch(err)
            {
                console.log(err);
                res.status(500).send('Internal Problem')
            }
        }
        else res.status(401).send("Not logged in" + user);
    }

    //Users Methods

    async getUser(req,res)
    {
        const data = await this.isAuth(req);
        if(data.code===200)
        {
            if(data.type==='teacher'||data.username===req.params.username)
            {
                try 
                {
                    const result = await userModel.getUserByUsername(req.params.username)
                    delete result.password;
                    res.json(result||{user: false})
                }
                catch(err)
                {
                   //console.log(err)
                   res.status(500).send('Database error. Please try again later or contact administrator')
                }
               
            }
            else res.status(401).send('U don\'t have permission')
        }
        else res.status(403).send('No permission')
    }

    async insertUser(req,res)
    {
        const {username, password, type} = req.body;
        //console.log(username, password,type)
        if(username&&password&&type)
        {
            const user = await this.isAuth(req);
            if(user.type==='teacher')
            {
                if(emailSchema.validate(username)&&passwordSchema.validate(password)&&(type==='student'||type==='teacher'))
                {
                    if(await userModel.checkIfUserIsInDb(username)===false)
                    {
                        const hashedPassword = hash(password);
                        try
                        {
                            const result = await userModel.insertUser(username,hashedPassword,type)
                            if(result) res.status(200).send('New user created')
                            else res.status(500).send('Cannot insert user to database')
                        }
                        catch(err)
                        {
                            res.status(500).send('Database error. Try again later or contact administrator')
                        }
                    }
                    else res.status(400).send('User already exist')
                }
                else res.status(400).send('Invalid data')
            }
            else res.status(401).send('No permission')
        }
        else res.status(400).send('Missing data')
    }

    async modifyUser(req,res)
    {

    }

    async deleteUser(req,res)
    {
        const user = await this.isAuth(req);
        if(user.username===req.params.username)
        {
            try {
                if(await userModel.deleteUserByUsername(req.params.username)) 
                {
                    
                    res.status(200).send('Accout deleted.')
                }
                else res.status(500).send('Cannot delete this account.')
            }
            catch (err)
            {
                res.status(500).send('problem with database. Please try again later or contact administrator')
            }
        }
        else res.status(401).send('No permission. Only owner of the account, can delete it')
    }

    //Questions Methods
    async getQuestion(req,res)
    {
        console.log(req.params.id)
        if(req.params.id)
        {
            const question = await questionModel.getOneQuestion(req.params.id);
            res.status(200).json(question);
        }
        else res.status(404).send('Cannot access this question');
    }

    async getQuestions(req,res)
    {
        let query = {};
        const data =this.isAuth(req)
        const username = data.username || null;

        if(req.query.tag) Object.assign(query,{tags: {$all: [req.query.tag]}});
        if(req.query.tags) Object.assign(query, {tags: {$all: req.query.tags}});
        if(req.query.image&&req.query.image!=='false') Object.assign(query, {img: {$ne: ""}})
        if(req.query.image&&req.query.image==='false') Object.assign(query, {img: ""})
        if(req.query.correct) Object.assign(query, {correct: req.query.correct})

        const access = [] 
        if(req.query.author)
        {
            access.push({$and: [
                {author: req.query.author},
                {public: true}
            ]});
        } 

        if(req.query.public==='private')
        {
            access.push(query, {$and: [
                {author: username},
                {public: false} 
            ]})
        }
        
        if(access.length<=0) Object.assign(query,{public: true})
        else Object.assign(query,{$or: access})

        //console.log(query)
        if(JSON.stringify(query)!=='{}') 
        {
            try
            {
                const result = await questionModel.getAllQuestions(query);
                result.forEach((el)=>{
                    delete el.public;
                    delete el.slug;
                    delete el.author;
                    if(el.img==="") delete el.img;
                })
                res.send(result)
            }
            catch(e)
            {
                res.status(500).send('Internal error')
            }
            
        }
        else res.status(400).send('U need to add search parameter, like tag or tags, author, image or correct answer letter')
    }

    async insertQuestion(req,res)
    {
        const user = await this.isAuth(req);
        console.log(user)
        
        if(user.type==='teacher')
        {
            let {content, correct, tags, isPublic } = req.body;
            const file = req.files;
            if(content&&correct&&tags)
            {
                correct = correct.toUpperCase()
                const problems = [];
                if((correct.length===1&&['A','B','C','D','*'].includes(correct.toUpperCase()))===false) problems.push('Correct letter should only contains one letter like a,b,c,d or *')

                if(tags.length===0) problems.push('Question need at least one tag');
                const hasAnswers = new RegExp(/(A\.)|(B\.)|(C\.)|(D\.)/).test(content)
                if(hasAnswers)
                {
                    content = content.replaceAll('\n');
                    content = content.replace(/(A\.)|(B\.)|(C\.)|(D\.)/g, "\n").split('\n');
                } 
                else problems.push('Invalid or missing answers.')

                if(problems.length>0) res.status(400).send(problems)
                else 
                {
                    isPublic = isPublic || true;
                    let img;
                   if(req.files)
                   {
                        img = req.files.image || undefined;
                   }
                   else img = undefined;
                    try
                    {
                        const isImg = (img !== undefined);
                        const result = await questionModel.insertQuestion(content,correct,tags, user.username,isPublic,isImg)
                        if(isImg)
                        {
                            let name = img.name.split('.'); 
                            img.name = result.id + "." + name.at(-1);
                            img.mv(__dirname+'/public/images/upload/'+ img.name);
                        }
                        res.status(200).send('Question Created')
                    }
                    catch(err)
                    {
                        console.log(err);
                        res.status(500).send('Internal Error')
                    }
                    
                }
            }
            else res.status(400).send('Missing data')
        }
        else res.status(401).send('No permission')
    }

    async modifyQuestion(req,res)
    {

    }

    async correctQuestion(req,res)
    {

    }
    
    async deleteQuestion(req,res)
    {

    }

    //Groups methods

    async getGroup(req,res)
    {
        const user = await this.isAuth(req) 
        if(req.params.id)
        {
            try{
                const result = await groupModel.getGroup(req.params.id);
                console.log(result.members, result.teacher, user)
                if(result.members.includes(user.username)||result.teacher===user.username)
                    res.status(200).json(result);
                else res.status(401).send('No permission')

            }
            catch(err)
            {
                res.status(500).send("Internal error")
            }  
        }
        else res.status(500).send('U don\'t have permission');
    }

    async insertGroup(req,res)
    {
        const user = await this.isAuth(req);
        console.log(user)
        if(user.type==='teacher')
        {
            const {name,members} = req.body;
            if(name&&members)
            {
                try
                {
                    const result = await groupModel.addGroup(name,user.username,members);
                    console.log(result)
                    res.status(200).send('Group Created with id ' +result.insertedId );
                }
                catch(err)
                {
                    console.log(err)
                    res.status(500).send('Internal error')
                }
            }
            else res.status(400).send('Missing Data')
        }
        else
        {
            res.status(401).send('No permission')
        }  
    }

    async modifyGroup(req,res)
    {

    }

    async deleteGroup(req,res)
    {

    }

    //Exams Methods

    async getExam(req,res)
    {
        const user = this.isAuth(req);
        if(req.params.id)
        {
            try
            {
                let result = await examModel.getExam(req.params.id);
                result.questions = await questionModel.getMultipleQuestions(result.questions);
                res.status(200).json(result);
            }
            catch(err)
            {
                console.log(err)
                res.status(500).send('Internal error')
            }
        }
        else res.status(400).send('missing params')
    }

    async getExams(req,res);
    {
        const user = this.isAuth(req);
        let query = {} 
    }

    async insertExam(req,res)
    {
        const user = await this.isAuth(req);
        console.log(user)
        const {name,questions,assignedTo,active} = req.body;
        if(user.type==='teacher')
        {
            if(name&&questions&&assignedTo&&Array.isArray(questions))
            {
                try
                {
                    const result = await examModel.insertExam(name,user.username,questions,assignedTo,active||false);
                    res.status(200).json(result);
                }
                catch(err)
                {
                    console.log(err)
                    res.status(500).send('Internal server error');
                }
            }
            else res.status(400).send('Missing data');
        }
        else res.status(401).send('No permission');
    }

    //answers

    async getAnswer(req,res)
    {
        const user = await this.isAuth(req)
        if(user.code===200)
        {
            if(user.type==='student')
            {
                try
                {
                    const result = await  answerModel.getAnswer(id)
                    res.status(200).json(result);
                }
                catch(err)
                {
                    throw "Internal Problem";
                }
            }
            else if(user.type==='teacher')
            {
                let query;
                if(req.query.exam) query = {examId:req.query.exam}; 
                else if(req.query.username) { query = {user:req.query.username}}
                else res.status(400).send('Missing Data');
                console.log(query);
                try
                {
                    if(query)
                    {
                        const result = await  answerModel.getAnswers(query)
                        //console.log(result);
                        res.status(200).json(result);
                    }
                    
                }
                catch(err)
                {
                    throw "Internal Problem"
                }
            }
            else res.status(400).send('Unknown user type');
        }
        else res.status(401).send('No permission')
    }

    async insertAnswer(req,res)
    {
        const user = await this.isAuth(req);
        if(user.code===200)
        {
            const {examId,answers} = req.body;
            console.log(answers)
            if(examId&&answers)
            {
                try{
                    const result = answerModel.insertAnswer(user.username, examId, answers);
                    res.status(200).json(result);
                }
                catch(err)
                {
                    console.log(err);
                    res.status(500).send('Internal Error');
                }
            }
            else res.status(400).send('Invalid Request');          
        }
        else res.status(201).send('No Permission');
    }
}

module.exports = new apiController()
const jwt = require('jsonwebtoken');
const { hash, emailSchema, passwordSchema} = require('../config');
const userModel = require('../model/users')
const questionModel = require('../model/questions');
const groupModel = require('../model/groups')
const examModel = require('../model/exams')
const answerModel = require('../model/answers');
const JWTSECRET = process.env.JWTSECRET || "iufghvkledsrkgl;'erfhkloegkledtjhnlvbpryhnkgl;nml;t'thl;hlbl;fp[6yryg,rtfd;'h,rt;'hb,l;l;gbrthledt'kjrtjlk,t;'jhlrp[yfjkh[]re";

class apiController
{

    constructor()
    {
        this.isAuth = this.isAuth.bind(this);
        this.auth = this.auth.bind(this);
        this.getMe = this.getMe.bind(this);
        this.handleAuth = this.handleAuth.bind(this);

        this.getUser = this.getUser.bind(this);
        this.insertUser = this.insertUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.modifyUser = this.modifyUser.bind(this);

        this.getQuestions = this.getQuestions.bind(this);
        this.insertQuestion = this.insertQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.modifyQuestion = this.modifyQuestion.bind(this);

        this.insertGroup = this.insertGroup.bind(this);
        this.getGroup = this.getGroup.bind(this);
        this.getGroups = this.getGroups.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.modifyGroup = this.modifyGroup.bind(this);

        this.getExam = this.getExam.bind(this);
        this.getExams = this.getExams.bind(this)
        this.insertExam = this.insertExam.bind(this);
        this.deleteExam = this.deleteExam.bind(this);
        this.modifyExam = this.modifyExam.bind(this);

        this.insertAnswer = this.insertAnswer.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
    }

    docs (req,res,next)
    {
        res.render('docs')
    }

    auth(username,type)
    {
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
        if(!token)
        {
            return {code: 403, comment: 'any token send'}
        }
        try
        {
            const decoded = Object.assign({code: 200, comment:'ok'},jwt.verify(token, JWTSECRET));
            return(decoded);
        }
        catch(err)
        {
            return {code: 401, comment: 'Invalid token'}
    
        }

    }

    async handleAuth(req,res)
    {
        const {username, password} = req.body;
        if(username&&password)
        {
            const hashedPassword = hash(password);
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
        const user = await this.isAuth(req);
        if(user.code===200)
        {
            try{
                const result = await userModel.getUserByUsername(user.username);
                res.status(200).json(result);
            }
            catch(err)
            {
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

    async deleteUser(req,res)
    {
        const user = await this.isAuth(req);
        if(user.username===req.params.username)
        {
            try 
            {
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

    async modifyUser(req,res)
    {
        const user = await this.isAuth(req);
        if(req.params.username)
        {
            if(req.params.username===user.username)
            {
                const newPassword = req.body.password;
                if(passwordSchema.validate(newPassword))
                {
                    const hashedNewPassword = hash(newPassword);
                    try
                    {
                        const result = await userModel.modifyUser(user.username,{password: hashedNewPassword})
                        res.status(200).send('Updated')
                    }
                    catch(err)
                    {
                        res.status(500).send('Internal Error')
                    }
                    
                }
                else res.status(400).send('invalid new Password')
            }
            else res.status(401).send("No permission.")
        }
        else res.status(400).send('Missing username')
    }

    //Questions Methods

    async getQuestion(req,res)
    {
        if(req.params.id)
        {
            try
            {
                const question = await questionModel.getOneQuestion(req.params.id);
                res.status(200).json(question);
            }
            catch(err)
            {
                res.status(500).send("Internal Problem")
            }
            
        }
        else res.status(404).send('Cannot access this question');
    }

    async getQuestions(req,res)
    {
        let query = {};
        const data = await this.isAuth(req)
        if(data.code===200)
        {
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
        else res.status(401).send('No permission')
    }

    async insertQuestion(req,res)
    {
        const user = await this.isAuth(req);
        if(user.type==='teacher')
        {
            let {content, correct, tags, isPublic } = req.body;
            const files = req.files;
            if(content&&correct&&tags)
            {
                correct = correct.toUpperCase()
                const problems = [];
                if((correct.length===1&&['A','B','C','D','*'].includes(correct.toUpperCase()))===false) 
                    problems.push('Correct letter should only contains one letter like a,b,c,d or *')
                if(tags) 
                {
                    Array.isArray(tags)? tags : tags = [tags];
                }
                else problems.push('Question need at least one tag');
                const hasAnswers = new RegExp(/(A\.)|(B\.)|(C\.)|(D\.)/).test(content)
                try
                {
                    if(hasAnswers)
                    {
                        content = content.replaceAll('\n','');
                        content = content.replace(/(A\.)|(B\.)|(C\.)|(D\.)/g, "\n").split('\n');
                    } 
                    else problems.push('Invalid or missing answers.')
                    
                    content = content.map(el=>el.trim())
                }
                catch(err)
                {
                    res.status(400).send('Invalid Content');
                    next();
                    return;
                }
                
                if(problems.length>0) res.status(400).send(problems)
                else 
                {
                  if(isPublic||isPublic==='false')
                  {
                    if(isPublic===true||isPublic==='true'||isPublic>=1) isPublic=true
                    else isPublic=false
                  }
                    let img;
                    if(req.files)
                    {
                            img = req.files.image || undefined;
                    }
                    else img = undefined;
                    try
                    {
                        const result = await questionModel.insertQuestion(content,correct,tags, user.username,isPublic,(img!==undefined))
                        if(img)
                        {
                            let name = img.name.split('.'); 
                            name = result.insertedId + "." + 'png'//name.at(-1);
                            img.name = name;
                            img.mv('../Back-End/public/images/upload/'+img.name);
                        }
                        res.status(200).send('Question Created')
                    }
                    catch(err)
                    {
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
        const user = await this.isAuth(req);
        let query = {};

        if(req.params.id)
        {
            let lookedQuestion
            try
            {
                lookedQuestion = await questionModel.getOneQuestion(req.params.id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                next();
            }
            if(lookedQuestion!==null)
            {
                if(lookedQuestion.author===user.username)
                {
                    const {content,answerA, answerB,answerC,answerD,correct}= req.body;
                    if(content) query = Object.assign(query,{content: content})
                    if(answerA) query = Object.assign(query,{answerA: answerA})
                    if(answerB) query = Object.assign(query,{answerB: answerB})
                    if(answerC) query = Object.assign(query,{answerC: answerC})
                    if(answerD) query = Object.assign(query,{answerD: answerD})
                    if(correct&&correct.length===1) query = Object.assign(query,{correct: correct.toUpperCase()})

                    try
                    {
                        const result = await questionModel.modifyQuestion(req.params.id,query);
                        res.status(200).json(result);
                    }
                    catch(err)
                    {
                        res.status(500).send('Internal Error')
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to modify');
        }
        else res.status(400).send('Missing Question ID');
    }
    
    async deleteQuestion(req,res,next)
    {
        const user = await this.isAuth(req);

        if(req.params.id)
        {
            let lookedQuestion
            try
            {
                lookedQuestion = await questionModel.getOneQuestion(req.params.id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                next();
            }

            if(lookedQuestion!==null)
            {
                if(lookedQuestion.author===user.username)
                {
                    try
                    {
                        const result  = await questionModel.deleteQuestion(req.params.id);
                        res.status(200).send("Deleted question");
                    }
                    catch(err)
                    {
                        res.status(500).send("Internal Probelm");
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to delete');
        }
    }

    //Groups methods

    async getGroup(req,res)
    {
        const user = await this.isAuth(req) 
        if(req.params.id)
        {
            try{
                const result = await groupModel.getGroup(req.params.id);
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

    async getGroups(req,res)
    {
        const user = this.isAuth(req);
        let query = {} ;
        const {member, teacher} = req.query
        if(member)
        {
            query = {members: {$all: [member]}}
            try
            {
                const result = await groupModel.getGroups(query)
                res.status(200).json(result)
            }
            catch(err)
            {
                res.status(500).send('Internal Error')
            }
        }
        else if(teacher)
        {
            query = {teacher: teacher}
            try
            {
                const result = await groupModel.getGroups(query)
                res.status(200).json(result)
            }
            catch(err)
            {
                res.status(500).send('Internal Error')
            }
        }
        else res.status(400).send("Missing query")
    }

    async insertGroup(req,res)
    {
        const user = await this.isAuth(req);
        if(user.type==='teacher')
        {
            const {name,members} = req.body;
            if(name&&members)
            {
                try
                {
                    const result = await groupModel.insertGroup(name,user.username,members);
                    res.status(200).send('Group Created with id ' +result.insertedId );
                }
                catch(err)
                {
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
        const user = await this.isAuth(req);
        let query = {};
        if(req.params.id)
        {
            let lookedGroup
            try
            {
                lookedGroup = await groupModel.getGroup(req.params.id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                next();
            }
            if(lookedGroup!==null)
            {
                if(lookedGroup.teacher===user.username)
                {
                    let {toDelete,toInsert} = req.body
                    if(toDelete)
                    {
                        if(Array.isArray(toDelete)===false) toDelete = [toDelete]; 
                        query = Object.assign(query,{$pull: {"members":toDelete}})
                    }

                    if(toInsert)
                    {
                        if(Array.isArray(toInsert)===false) toInsert = [toInsert];
                        query = Object.assign(query, {$push: {"members": {$each: toInsert}}})
                    }

                    const id = req.params.id
                    try
                    {
                        const result = await groupModel.modifyGroup(id ,query);
                        res.status(200).json(result);
                    }
                    catch(err)
                    {
                        res.status(500).send('Internal Error')
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to modify');
        }
        else res.status(400).send('Missing Question ID');
    }

    async deleteGroup(req,res,next)
    {
        const user = await this.isAuth(req);
        if(req.params.id)
        {
            let lookedGroup
            try
            {
                lookedGroup = await groupModel.getGroup(req.params.id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                next();
                return;
            }
            if(lookedGroup!==null&&lookedGroup!==undefined)
            {
                if(lookedGroup.teacher===user.username)
                {
                    try
                    {
                        const result  = await groupModel.deleteGroup(req.params.id);
                        res.status(200).send("Deleted group");
                        next();
                        return;
                    }
                    catch(err)
                    {
                        res.status(500).send("Internal Probelm");
                        next();
                        return;
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to delete');
        }
        res.status(400).send('Missing Id of Group')
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
                res.status(500).send('Internal error')
            }
        }
        else res.status(400).send('missing params')
    }

    async getExams(req,res)
    {
        const user = this.isAuth(req);
        let query = {} ;
        const {author, assigned} = req.query
        if(author||assigned)
        {
            if(author) query.author = author;
            if(assigned) query.assignedTo = assigned;
            try
            {
                const result = await examModel.getExams(query);
                res.status(200).send(result)
            }
            catch(err)
            {
                res.status(500).send('Internal Error')
            }
        }
        else res.status(400).send("Missing query")
    }

    async insertExam(req,res)
    {
        const user = await this.isAuth(req);
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
                    res.status(500).send('Internal server error');
                }
            }
            else res.status(400).send('Missing data');
        }
        else res.status(401).send('No permission');
    }

    async deleteExam(req,res,next)
    {
        const user = await this.isAuth(req);
        const id = req.params.id
        if(req.params.id)
        {
            let lookedExam;
            try
            {
                lookedExam = await examModel.getExam(id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                return 0;
            }
            if(lookedExam)
            {
                if(lookedExam.author===user.username)
                {
                    try
                    {
                        const result  = await examModel.deleteExam(id);
                        res.status(200).send("Deleted Exam");
                    }
                    catch(err)
                    {
                        res.status(500).send("Internal Probelm");
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to delete');
        }
        else res.status(400).send('Bad Request')
    }

    async modifyExam(req,res)
    {
        const user = await this.isAuth(req);
        let query = {};
        if(req.params.id)
        {
            let lookedExam
            try
            {
                lookedExam = await examModel.getExam(req.params.id);
            }
            catch(err)
            {
                res.status(500).send('Internal Error');
                next();
            }
            if(lookedExam!==null)
            {
                if(lookedExam.author===user.username)
                {
                    let {toDelete,toInsert,active} = req.body
                    if(toDelete)
                    {
                        if(Array.isArray(toDelete)===false) toDelete = [toDelete]; 
                        query = Object.assign(query,{$pull: {"questions":toDelete}})
                    }

                    if(toInsert)
                    {
                        if(Array.isArray(toInsert)===false) toInsert = [toInsert];
                        query = Object.assign(query, {$push: {"questions": {$each: toInsert}}})
                    }

                    if(active!==undefined)
                    {
                        if(active===1||active==='true'||active===true) query = Object.assign(query,{active: true})
                        else if(active===0||active==='false'||active===false) query = Object.assign(query,{active: false})
                    }

                    const id = req.params.id
                    try
                    {
                        const result = await examModel.modifyExam(id ,query);
                        res.status(200).json(result);
                    }
                    catch(err)
                    {
                        res.status(500).send('Internal Error')
                    }
                }
                else res.status(401).send('No Permission');
            }
            else res.status(404).send('Nothing to modify');
        }
        else res.status(400).send('Missing Question ID');
    }

    //Answer Methods

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
                try
                {
                    if(query)
                    {
                        const result = await  answerModel.getAnswers(query)
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
            if(examId&&answers)
            {
                try
                {
                    const result = answerModel.insertAnswer(user.username, examId, answers);
                    res.status(200).json(result);
                }
                catch(err)
                {
                    res.status(500).send('Internal Error');
                }
            }
            else res.status(400).send('Invalid Request');          
        }
        else res.status(401).send('No Permission');
    }
}

module.exports = new apiController()
const jwt = require('jsonwebtoken');
const { hash } = require('../config');
const userModel = require('../model/users')
const JWTSECRET = process.env.JWTSECRET || "iufghvkledsrkgl;'erfhkloegkledtjhnlvbpryhnkgl;nml;t'thl;hlbl;fp[6yryg,rtfd;'h,rt;'hb,l;l;gbrthledt'kjrtjlk,t;'jhlrp[yfjkh[]re";

module.exports = 
{
    

    docs: function(req,res,next)
    {
        res.render('docs')
    },

    auth : async function(username,type)
    {
        return  jwt.sign({ username:username, type: type}, JWTSECRET, {expiresIn: '3600s'})
    },

    isAuth: async function(req)
    {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!token)
        {
            return {code: 403, comment: 'any token send'}
        }
        try
        {
            const decoded = jwt.verify(token, JWTSECRET);
            console.log(decoded);
            return(decoded);
        }
        catch(err)
        {
            return {code: 401, comment: 'Invalid token'}
        }

    },

    handleAuth: async function(req,res)
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
    },

    //Users Methods

    getUsers: async function(req,res,next)
    {

    },

    getUser: async function(req,res,next)
    {

    },

    postUser: async function(req,res,next)
    {

    },

    putUser: async function(req,res,next)
    {

    },

    patchUser: async function(req,res,next)
    {

    },

    deleteUser: async function(req,res,next)
    {

    },

    //Question Methods


    getQestions: async function(req,res,next)
    {

    },

    getQestion: async function(req,res,next)
    {

    },

    postQestion: async function(req,res,next)
    {

    },

    putQestion: async function(req,res,next)
    {

    },

    patchQestion: async function(req,res,next)
    {

    },

    deleteQestion: async function(req,res,next)
    {

    }


    //Groups Methods

    //Exams Methods
}
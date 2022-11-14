const { ObjectId } = require('mongodb');
const Database = require('./database');

class Questions extends Database
{
    constructor()
    {
        super();
        this.collection = this.db.collection('Questions')
    }

    async getOneQuestion(id)
    {
        if(id)
        {
            try
            {
                const result = await this.collection.findOne({_id:ObjectId(id)})
                //console.log(result)
                return result;
            }
            catch(err) 
            {
                console.log(err)
                throw 'internal error';
            }   
        }
        else throw "Missing argument";
    }

    async getAllQuestions(query)
    {
        try
        {
            const result = await this.collection.find(query).toArray();
            //console.log(result)
            return result;
        }
        catch(err) 
        {
            console.log(err)
            throw "Internal Error"
        }   
    }

    async insertQuestion(content, correct, tags,author,isPublic,img)
    {
        isPublic = isPublic || true;
        if(content&&correct&&tags&&isPublic&&content.length>4&&correct.length===1)
        {
            try
            {
               return await this.collection.insertOne({content: content[0], answerA: content[1], answerB: content[2], answerC: content[3], answerD: content[4], correct: correct, img: img,tags:tags,author: author, public: isPublic})
            }
            catch(err)
            {
                console.log(err);
                throw "Error during inserting new user"
            }
        }
        else throw "Missing or invalid arguments";
    }

    async getMultipleQuestions(arrayOfIds)
    {
        if(arrayOfIds&&Array.isArray(arrayOfIds))
        {
            let query = arrayOfIds.map(el=> el=ObjectId(el));
            try
            {
                let result = await this.collection.find({_id: {$in: query}}).toArray()
                console.log(result);
                return result;
            }
            catch(err)
            {
                console.log(err);
                throw "Internal Problem"
            }
        }
        else throw "Missing Arguments"
    }

    async deleteQuestion(id)
    {
        if(id)
        {
        try 
        {
            const result = await this.collection.deleteOne({_id: ObjectId(id)});
        }
        catch(err)
        {
            console.log(err)
            throw "Internal Error"
        }
        }
        else throw "Missing argument ID"
    }

    async modifyQuestion(id,update)
    {
        if(update&&id)
        {
            try
            {
                const result = await this.collection.updateOne({_id: ObjectId(id)}, {$set: update});
                return result;
            }
            catch(err)
            {
                console.log(err);
                throw "Internal error";
            }
        }
        else throw "Mising argument(s)"
    }
}

module.exports = new Questions()
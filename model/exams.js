const { ObjectId } = require('mongodb');
const Database = require('./database');

class Groups extends Database
{
    constructor()
    {
        super();
        this.collection = this.db.collection('Exams')
    }

    async getExam(id)
    {
        if(id)
        {
            try
            {
                const result = await this.collection.findOne({_id: ObjectId(id)});
                console.log(result)
                if(result) return result;
                else throw "Nothing found";
            }
            catch(err)
            {
                throw "Internal Problem"
            }
        }
        else throw 'Missing Argument(s)'
    }

    async getExams(query)
    {
        if(query)
        {
            try
            {
                return await this.collection.find(query).toArray();
            }
            catch(err)
            {
                console.log(err);
                throw "Internal Error";
            }
        }
        else throw "Missing argument";
    }

    async insertExam(name,author,questions,assignedTo,active)
    {
        if(name&&author&&questions&&assignedTo&&Array.isArray(questions))
        {
            try
            {
                if(active) active=true; 
                else active = false;
                const result = await this.collection.insertOne({name:name,author:author,questions:questions,assignedTo:assignedTo,active:active});
                return result;
            }
            catch(err)
            {
                console.log(err);
                throw "Internal problem";
            }
        }
        else throw "Missing or incorrect arguments";
    }

    async deleteExam(id)
    {
        if(id)
        {
        try 
        {
            const result = await this.collection.deleteOne({_id: new objectId(id)});
            if(result.count=== 1) return result;
            else throw "Invalid ID, nothing deleted"
        }
        catch(err)
        {
        throw "InternalError"
        }
        }
        else throw "Missing argument ID"
    }

    async modifyExam(id,update)
    {
        if(update&&id)
        {
            
            try
            {
                let result1="nothing pushed", result2 = "nothing pulled";
                if(update.$push) result1 = await this.collection.updateOne({_id: ObjectId(id)}, {$push: update.$push});
                if(update.$pull) result2 = await this.collection.updateOne({_id: ObjectId(id)}, {$pull: {questions: {$in: update.$pull.members}}});
                return JSON.stringify(result1) + JSON.stringify(result2);
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

module.exports = new Groups();
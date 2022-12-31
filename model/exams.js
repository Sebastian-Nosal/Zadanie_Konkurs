const { ObjectId } = require('mongodb');
const Database = require('./database');

class Exams extends Database
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
                if(query.author&&query.assigned) return await this.collection.find({$and: [{assignedTo: query.assignedTo}, {author:query.author}]}).toArray();
                return await this.collection.find({$or: [{assignedTo: query.assignedTo}, {author:query.author}]}).toArray();
            }
            catch(err)
            {
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
                
                const result = await this.collection.deleteOne({_id: ObjectId(id)});
                if(result.deletedCount=== 1) return result;
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
                let result1="nothing pushed", result2 = "nothing pulled", result3 = 'nothing changed';
                if(update.$push) result1 = await this.collection.updateOne({_id: ObjectId(id)}, {$push: update.$push});
                if(update.$pull) result2 = await this.collection.updateOne({_id: ObjectId(id)}, {$pull: {questions: {$in: update.$pull.members}}});
                if(update.active||update.active===false) result3 = await this.collection.updateOne({_id: ObjectId(id)}, {$set: {active: update.active}})
                return JSON.stringify(result1) + JSON.stringify(result2) + JSON.stringify(result3);
            }
            catch(err)
            {
                throw "Internal error";
            }
        }
        else throw "Mising argument(s)"
    }
}

module.exports = new Exams();
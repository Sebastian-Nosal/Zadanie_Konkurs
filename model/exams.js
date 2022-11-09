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

    async insertExam(name,author,questions,assignedTo,active)
    {
        if(name&&author&&questions&&assignedTo&&Array.isArray(questions))
        {
            try
            {
                active = active||false
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
}

module.exports = new Groups();
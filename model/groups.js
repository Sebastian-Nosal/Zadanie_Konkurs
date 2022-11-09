const { ObjectId } = require('mongodb');
const Database = require('./database');

class Groups extends Database
{
    constructor()
    {
        super();
        this.collection = this.db.collection('Group')
    }

    async addGroup(name,teacher,members)
    {
        console.log(typeof members);
        console.log(members);
        try{
            if(name&&teacher&&members&&Array.isArray(members))
            {
                const result  = await this.collection.insertOne({_id : ObjectId(), name: name, teacher:teacher,members:members});
                return result;
            }
            else throw "Missing Arguments"
        }
       catch(error)
       {
        return error;
       }
    }

    async getGroup(id)
    {
        if(id)
        {
            try 
            {
                return await this.collection.findOne({_id:ObjectId(id)})
            }
            catch(err)
            {
                throw "Database Problem"
            }
        }
        else throw "Missing argument"
    }
}

module.exports = new Groups();
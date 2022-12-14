const { ObjectId } = require('mongodb');
const Database = require('./database');

class Groups extends Database
{
    constructor()
    {
        super();
        this.collection = this.db.collection('Group')
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

    async getGroups(query)
    {
        if(query)
        {
            try
            {
                const result = await this.collection.find(query).toArray();
                return result;
            }
            catch(err)
            {
                throw "Internal Error"
            }
        } else throw "Missing argument"
    }

    async insertGroup(name,teacher,members)
    {
        try
        {
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

    async deleteGroup(id)
    {
        if(id)
        {
            try 
            {
                const result = await this.collection.deleteOne({_id: new ObjectId(id)});
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

    async modifyGroup(id,update)
    {
        if(update&&id)
        {
            
            try
            {
                let result1="nothing pushed", result2 = "nothing pulled";
                if(update.$push) result1 = await this.collection.updateOne({_id: ObjectId(id)}, {$push: update.$push});
                if(update.$pull) result2 = await this.collection.updateOne({_id: ObjectId(id)}, {$pull: {members: {$in: update.$pull.members}}});
                return JSON.stringify(result1) + JSON.stringify(result2);
            }
            catch(err)
            {
                throw "Internal error";
            }
        }
        else throw "Mising argument(s)"
    }

}

module.exports = new Groups();
const { ObjectId } = require('mongodb');
const Database = require('./database');

class Users extends Database
{
  constructor()
  {
    super();
    this.collection = this.db.collection('Users');
    this.checkIfUserIsInDb = this.checkIfUserIsInDb.bind(this);
  }

  async getUserById(id)
  {
      try
      {
          let result = await this.collection.findOne({_id: new ObjectId(id)})
          delete result.password;
          return result;
      }
      catch(err)
      {
          throw "Internal Error";
      }
  }

  async getUserByUsername(username)
  {
      try
      {
          const result = await this.collection.findOne({name: username})
          delete result.password;
          return result;
      }
      catch(err)
      {
          return null;
      }
    
  }

  async insertUser(username,hash,type)
  {
      if(username,hash,type)
      {
          if(await this.checkIfUserIsInDb(username)===false)
          {
              try 
              {
                  const result = await this.collection.insertOne({_id:new ObjectId(),name:username,password: hash,type: type})
                  return true
              }
              catch (err)
              {
                return false
              }
            }
            else return false
      }
      else return false;
  }

  async deleteUserById(id)
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

  async deleteUserByUsername(username)
  {
    if(username)
    {
        try 
        {
            const result = await this.collection.deleteOne({name: username});
            if(result.count=== 1) return true;
            else return false;
        }
        catch(err)
        {
            return false
        }
    }
    else return false
  }

  async checkIfUserIsInDb(username)
  {
      const result = await this.collection.findOne({name: username})
      if(result) return true;
      else return false;
  }

  async checkCredentials(username, hash)
  {
      const result = await this.collection.find({ $and: [{name:username}, {password:hash}]}).toArray();
      if(result.length===1) return true;
      else return false;
  }

  async modifyUser(username,update)
    {
        if(update&&username)
        {
            try
            {
                const result = await this.collection.updateOne({name: username}, {$set: update});
                return result;
            }
            catch(err)
            {
                throw "Internal error";
            }
        }
        else throw "Mising argument(s)"
    }

}

module.exports = new Users()
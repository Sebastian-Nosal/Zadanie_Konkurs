const Database = require('./database');

class Users extends Database
{
  constructor()
  {
    super();
    this.collection = this.db.collection('Users')
    this.objectId = require('mongodb').ObjectId;
    console.log(`połączono z bazą danych + ${this.collection}`)
  }

  async getUserById(id)
  {
    const result = await this.collection.findOne({id: this.ObjectId(id)})
    console.log(result);
    return result;
  }

  async getUserByUsername(username)
  {
    const result = await this.collection.findOne({name: username})
    console.log(result);
    return result;
  }

  async insertUser(newUser)
  {
    const result = await this.collection.insertOne(newUser)
    console.log(result);
    return result;
  }

  async deleteUserById(id)
  {
    const result = await this.collection.findOneAndDeleteOne({id: this.objectId(id)});
    console.log(result);
    return result;
  }

  async deleteUserByUsername(username)
  {
    const result = await this.collection.findOneAndDeleteOne({name: username});
    console.log(result);
    return result;
  }

  async checkIfUserIsInDb(username)
  {
    const result = await this.collection.find({name: username}).toArray().length;
    if(result>0) return true;
    else return false;
  }

  async checkCredentials(username, hash)
  {
    const result = await this.collection.find({name: username, password: hash}).toArray().length;
    if(result>0) return true;
    else return false;
  }

}

module.exports = new Users()
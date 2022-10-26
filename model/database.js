const url = process.env.mongoClientUrl || 'mongodb://localhost:27017/mydb';

const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(url)


class Database {
  constructor() 
  {
    mongoClient.connect();
    this.db = mongoClient.db('Exams');
  }
}

module.exports = Database;
const url = process.env.mongoClientUrl || 'mongodb://localhost:27017/mydb';

const mongoClient = require('mongodb').MongoClient(url);


class Database {
  constructor() 
  {
    mongoClient.connect();
    this.db = mongoClient.db('Exams');
  }
}

module.exports = Database;
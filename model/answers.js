const { ObjectId } = require('mongodb');
const Database = require('./database');

class Answers extends Database
{
  constructor()
  {
    super();
    this.collection = this.db.collection('Answers')
  }

  async insertAnswer(user,examId,answers)
  {
    if(user&&examId&&answers)
    {
        try
        {
            const result = this.collection.insertOne({user: user, examId: examId, answers:answers, date: new Date()});
            return result;
        }
        catch(err)
        {
            console.log(err)
            throw "Internal Error";
        }
    }
    else throw "Missing argument";
  }

  async getAnswer(id)
  {
      if(id)
      {
        try
        {
          const result = await this.collection.findOne({_id: ObjectId(id)})
          return result;
        }
        catch(err)
        {
          console.log(err)
          throw "Internal Error";
        }
      }
      else throw "Missing Argument"
  }

  async getAnswers(query)
  {
    if(query&&typeof query === "object")
      {
        if(query.exam) {query.examId = new ObjectId(query.examId)}
        console.log(query)
        try
        {
          let result = await this.collection.find(query).toArray();
          return result;
        }
        catch(err)
        {
          console.log(err)
          throw "Internal Error";
        }
      }
      else throw "Missing or incorrect Argument"
  }

}

module.exports = new Answers();

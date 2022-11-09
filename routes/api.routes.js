/* eslint-disable linebreak-style */
const express = require('express');
const apiController = require('../controller/api_controller');

const apiRouter = express.Router();

apiRouter.get('/', apiController.docs);
apiRouter.post('/auth',apiController.handleAuth);

apiRouter.get('/users/:username', apiController.getUser)
apiRouter.post('/users', apiController.insertUser)
apiRouter.patch('/users/:username',apiController.modifyUser)
apiRouter.delete('/users/:username',apiController.deleteUser)

apiRouter.get('/questions',apiController.getQuestions)
apiRouter.get('/questions/:id',apiController.getQuestion)
apiRouter.post('/questions', apiController.insertQuestion)
apiRouter.put('/question/:id')
apiRouter.patch('/question/:id')
apiRouter.delete('/question/:id')

apiRouter.get('/exams/:id',apiController.getExam)
apiRouter.post('/exams/', apiController.insertExam)
apiRouter.put('/exams/:id')
apiRouter.patch('/exams/:id')
apiRouter.delete('/exams/id')

apiRouter.get('/groups/:id',apiController.getGroup)
apiRouter.post('/groups', apiController.insertGroup)
apiRouter.put('/groups/:id')
apiRouter.patch('/groups/:id')
apiRouter.delete('/groups/id')


module.exports = apiRouter;

/* eslint-disable linebreak-style */
const express = require('express');
const { inserAnswer } = require('../controller/api_controller');
const apiController = require('../controller/api_controller');
var cors = require('cors')

const apiRouter = express.Router();

// apiRouter.use(apiController.allowCors)
apiRouter.use(cors())

apiRouter.get('/', apiController.docs);
apiRouter.post('/auth',apiController.handleAuth);

apiRouter.get('/users/me', apiController.getMe)
apiRouter.get('/users/:username', apiController.getUser)
apiRouter.post('/users/', apiController.insertUser)
apiRouter.patch('/users/:username',apiController.modifyUser)
apiRouter.delete('/users/:username',apiController.deleteUser)

apiRouter.get('/questions/',apiController.getQuestions)
apiRouter.get('/questions/:id',apiController.getQuestion)
apiRouter.post('/questions/', apiController.insertQuestion)
apiRouter.put('/question/:id')
apiRouter.patch('/question/:id')
apiRouter.delete('/question/:id')

apiRouter.get('/exams/:id',apiController.getExam)
apiRouter.get('/exams/',apiController.getExams)
apiRouter.post('/exams/', apiController.insertExam)
apiRouter.put('/exams/:id')
apiRouter.patch('/exams/:id')
apiRouter.delete('/exams/id')

apiRouter.get('/groups/:id',apiController.getGroup)
apiRouter.post('/groups', apiController.insertGroup)
apiRouter.put('/groups/:id')
apiRouter.patch('/groups/:id')
apiRouter.delete('/groups/id')

apiRouter.get('/answers/', apiController.getAnswer)
apiRouter.get('/answers/:id', apiController.getAnswer)
apiRouter.post('/answers/', apiController.insertAnswer)

module.exports = apiRouter;

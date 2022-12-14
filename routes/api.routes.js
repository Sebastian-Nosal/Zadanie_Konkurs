const express = require('express');
const apiController = require('../controller/api_controller');

const apiRouter = express.Router();

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
apiRouter.patch('/questions/:id', apiController.modifyQuestion)
apiRouter.delete('/questions/:id', apiController.deleteQuestion)

apiRouter.get('/exams/',apiController.getExams)
apiRouter.get('/exams/:id',apiController.getExam)
apiRouter.post('/exams/', apiController.insertExam)
apiRouter.patch('/exams/:id', apiController.modifyExam)
apiRouter.delete('/exams/:id',apiController.deleteExam)

apiRouter.get('/groups/',apiController.getGroups)
apiRouter.get('/groups/:id',apiController.getGroup)
apiRouter.post('/groups/', apiController.insertGroup)
apiRouter.patch('/groups/:id',apiController.modifyGroup)
apiRouter.delete('/groups/:id', apiController.deleteGroup)

apiRouter.get('/answers/', apiController.getAnswer)
apiRouter.get('/answers/:id', apiController.getAnswer)
apiRouter.post('/answers/', apiController.insertAnswer)

module.exports = apiRouter;

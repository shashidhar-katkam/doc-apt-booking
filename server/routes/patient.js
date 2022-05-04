const userRouter = require('express').Router()

const patientController = require('../controllers/patient')




//userRouter.get('/addUser', addUser) // dddd


userRouter.post('/sign-up', patientController.signUp);
userRouter.post('/login', patientController.login);
userRouter.post('/logout', patientController.logout);
userRouter.get('/session', patientController.protect, patientController.getSession);


module.exports = userRouter
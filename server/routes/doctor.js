const userRouter = require('express').Router()

const DoctorController = require('../controllers/doctor')




//userRouter.get('/addUser', addUser) // dddd


userRouter.post('/sign-up', DoctorController.signUp);
userRouter.post('/login', DoctorController.login);
userRouter.post('/logout', DoctorController.logout);
userRouter.get('/session', DoctorController.protect, DoctorController.getSession);
userRouter.get('/getDoctorsBySpecialization', DoctorController.getDoctorsBySpecialization);



module.exports = userRouter
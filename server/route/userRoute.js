import express from 'express'
import { isAuth, login, logOut, register } from '../controllers/UserController.js'
import authUser from '../middleware/authUser.js'

const userRoute = express.Router()

userRoute.post('/register',register)
userRoute.post('/login', login)
userRoute.get('/is-auth',authUser, isAuth)
userRoute.get('/logout', authUser, logOut)
export default userRoute
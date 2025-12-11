import express from 'express'
import authUser from '../middleware/authUser.js'
import { getAllOrders, getUserOrders, placeOrder } from '../controllers/OrderController.js'
import authSeller from '../middleware/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod',authUser,placeOrder)
orderRouter.get('/user',authUser,getUserOrders)
orderRouter.get('/seller',authSeller,getAllOrders)

export default orderRouter

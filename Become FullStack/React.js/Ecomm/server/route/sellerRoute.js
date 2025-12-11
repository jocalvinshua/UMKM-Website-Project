import express from 'express'
import { isSellerAuth, sellerLogin, userLogout } from '../controllers/SellerController.js'
import authSeller from '../middleware/authSeller.js'

const sellerRoute = express.Router()

sellerRoute.post('/login', sellerLogin)
sellerRoute.get('/is-auth',authSeller, isSellerAuth)
sellerRoute.get('/logout', authSeller, userLogout)
export default sellerRoute
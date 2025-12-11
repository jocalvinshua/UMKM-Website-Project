import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userRoute from './route/userRoute.js'
import configDB from './config/configDB.js'
import cartRouter from './route/cartRoute.js'
import orderRouter from './route/orderRoute.js'
import sellerRoute from './route/sellerRoute.js'
import productRouter from './route/productRoute.js'
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const app = express()
const PORT = process.env.PORT || 3000

// Config
await configDB()

// Middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    credentials: true
}))

// Routes
app.get('/',(req,res)=>{
    res.send('Ecommerce Backend is running')
})

// API Routes
app.use('/api/user',userRoute)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/seller', sellerRoute)
app.use('/api/product', productRouter)

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
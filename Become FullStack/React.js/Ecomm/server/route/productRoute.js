import express from 'express';
import multer from 'multer';
import { addProduct, productById, productList, changeStock } from '../controllers/ProductController.js';
import authSeller from '../middleware/authSeller.js';

const productRouter = express.Router();

// Setup Multer (for handling image uploads)
const storage = multer.memoryStorage(); // or diskStorage if you want to save files locally
const upload = multer({ storage });

// Routes
productRouter.post('/add-product', authSeller, upload.array("images"), addProduct);
productRouter.get('/list', productList);
productRouter.get('/id/:id', productById);
productRouter.post('/change-stock', authSeller, changeStock);

export default productRouter;

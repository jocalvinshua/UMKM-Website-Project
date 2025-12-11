import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/Product.js'
import mongoose from 'mongoose'

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files;
        let imagesUrl = [];

        for (let item of images) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );

                stream.end(item.buffer);
            });

            const url = await uploadPromise;
            imagesUrl.push(url);
        }

        await Product.create({ ...productData, image: imagesUrl });

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


export const productList = async (req,res)=>{
    try {
        const products = await Product.find({})
        res.json({success:true,products})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export const productById = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!mongoose.Types.ObjectId.isValid(id)) {
             return res.status(400).json({ success: false, message: 'Invalid Product ID format.' });
        }
        const product = await Product.findById(id);
        if (!product) {
             return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const changeStock = async (req,res)=>{
    try {
        const { id, inStock } = req.body;

        // Validasi ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
             return res.status(400).json({ success: false, message: 'Invalid Product ID format.' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
        if (!updatedProduct) {
             return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: "Stock Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
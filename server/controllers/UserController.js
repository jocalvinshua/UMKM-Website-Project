import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register User
export const register = async (req,res)=>{
    try {
        const {name,email,password} = req.body

        if(!name || !email || !password){
            return res.json({success:false, message: 'Missing Details'})
        }

        // Check if user already exist
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({success:false, message:'User Already Exist'})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const user = await User.create({name, email, password: hashPassword})

        const token = jwt.sign({id: user._id},  process.env.SECRET_KEY, {expiresIn: '1d'})

        res.cookie('token', token,{
            hhtpOnly:true, // Prevent JavaScript to access cookie
            cookie: process.env.Node_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: `User ${email} Has Been Successfully Created`,name,email})
    } catch (error) {
        console.log(error.messsage)
        res.json({success:false, message:error.message})
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body

        if(!email||!password){
            return res.json({success:false, message:'Email and Password are Required'})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.json({success:false, message:'Invalid Email or Password'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false, message:'Invalid Email or Password'})
        }

        const token = jwt.sign({id: user._id},  process.env.SECRET_KEY, {expiresIn: '1d'})

        res.cookie('token', token,{
            hhtpOnly:true, // Prevent JavaScript to access cookie
            cookie: process.env.Node_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: `Successfully Login`,data: {name:user.name, email:user.email}})
    } catch (error) {
        console.log(error.messsage)
        res.json({success:false, message:error.message})
    } 
}

// Check Auth
export const isAuth = async(req,res)=>{
    const user = req.user; 
    if(user) {
        return res.json({success: true, message: 'Authenticated', user: user});
    }
    return res.status(500).json({success: false, message: 'User data missing after auth check'}); 
}

export const logOut = async (req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:  true,
            secure:process.env.NODE_ENV ==="production",
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        res.json({success:true,message:'Logged Out'})
    } catch (error) {
        console.log(error.messsage)
        res.json({success:false, message:error.message})
    }
}
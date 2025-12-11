import mongoose from 'mongoose'

const connectDB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        if(connect){
            console.log("Database Connected")
        }
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB
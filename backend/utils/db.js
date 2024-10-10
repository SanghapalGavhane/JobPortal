import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!!");

    }catch(err){
        console.error(err);
        console.log(err)

    }
    
}
export default connectDB;
import mongoose from "mongoose"
import {DB} from "../constants.js"


const connectDB = async () => {

  // const DB_NAME="YtClone"

  try{
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB}`)
    console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    
  }
  catch(err){
    console.log("MongoDB connection FAILED : ",err);
  }
}

export default connectDB
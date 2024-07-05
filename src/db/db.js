
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose
//       .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
//     console.log(`\nMongoDB Connected !!! \n DB HOST: ${connectionInstance.connection.host}`);

//   } catch (error) {
//     console.error("MONGODB Connection error: ", error)
//     process.exit(1);
//   }
// }

const DB = mongoose.connect('mongodb+srv://mdsiaofficial:1212@play.4emwa9f.mongodb.net/playvideo')

export default connectDB
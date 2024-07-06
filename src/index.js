// require('dotenv').config({ path: './env' })
// import 'dotenv/config'
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import express from "express";
const app = express();


dotenv.config({
  path: './env',
})


// Approach 1: write it in the same file
// ; (async () => {
//   try {
//     await mongoose
//       .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
//     app.on("error", (error) => {
//       console.log("Error connecting to database", error);
//       throw error
//     })

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listeding from ${process.env.PORT}`)
//     })
    
//   } catch (error) {
//     console.error("ERROR: ", error)
//     throw error
//   }
// })()

// Approach 2: coded in another file and imported
connectDB()
  .then( () => {
    app.listen(process.env.PORT, () => { 
      console.log(`Server is running on Port: http://localhost:${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error("MONGODB connection failed.", error);
})


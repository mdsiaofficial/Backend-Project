import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloud_name:process.env.CLOUDINARY_API_KEY,
  cloud_name:process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
  try {

    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto", })
    // file successfully uploaded
    console.log(`File is uploaded...`, response.url)
    return response;
  } catch (error) {
    console.error('File not uploaded'. error);
    fs.unlinkSync(localFilePath) //remove file path
    return null;
  }
}
cloudinary.v2.uploader.upload(
  "http://15.1.1.50:5000/uploads/a2afd313-28fa-48e2-9914-4f6b50b004a9.jpeg", 
  { public_id: "movie_poster",},
  (error, result) => { console.log(result) }
)
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
  // res.status(200).jsoon({
  //   message: "ok",
  // })
  try {
    
    // verify JWT token
    // add user to req.user
    // next()
    console.log(req.cookies);
    const token = req.cookies?.accessToken || req.header.authorization?.replace("Bearer", "");
    console.log(token)
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
    if (!user) {
      throw new ApiError(401, "Invalid Acess Token");
    }
  
    req.user = user;
    next();
  
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Access Token", error);
  }

})
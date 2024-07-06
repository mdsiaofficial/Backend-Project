import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
  // console.log(req);
  // res.status(200).json({
  //   message: "OK!",
  // })

  const { fullName, email, username, password } = req.body;
  console.log(email);

  // if (fullName === "") {
  //   throw new ApiError(400, "Full Name is Required");
  // }

  if (

    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = User.findOne({
    $or: [
      { email },
      { username },
    ]
  })

  if (existedUser) {
    throw new ApiError(409, "Email or Username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  console.log(req.files);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  })
  console.log(user);
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong!!! Do register again!!!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdUser, "User Created <Successfully>")
    );
});

export { registerUser };
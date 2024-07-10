import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateRefreshToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });


    return { accessToken, refreshToken };

  } catch (error) {
    throw new Error("Error generating access and refresh tokens");
  }
}
const registerUser = asyncHandler(async (req, res) => {
  // console.log(req);
  // res.status(200).json({
  //   message: "OK!",
  // })

  // Instructions:
  // fetch user data from frontend
  // validate data: not empty, valid email, valid username, valid password
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  // get user details from frontend: //
  const { fullName, email, username, password } = req.body;
  console.log(fullName);
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(email);

  if (fullName === "") {
    throw new ApiError(400, "Full Name is Required");
  }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "Email or Username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(coverImage);

  // Ensure avatar are successfully uploaded before proceeding
  if (!avatar) {
    throw new ApiError(400, "Failed to upload files to Cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  console.log(req);
  // res.status(200).json({
  //   message: "OK!",
  // })

  // fetch user data from frontend
  // validate data: not empty, valid email, valid password
  // check if user exists: email
  // check password
  // generate refresh token
  // remove password field from response
  // return res

  // get user details from frontend: //
  const { username, email, password } = req.body;
  console.log(email, " + ", password);

  if (!email && !username) {
    throw new ApiError(400, "Email/Username is required to login.")
  }

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    throw new ApiError(404, "User not found!!!");
  }
  console.log(user);

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  console.log(accessToken, refreshToken);

  const logedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  }
  console.log(accessToken);
  console.log(refreshToken);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      {
        user: logedInUser,
        accessToken,
        refreshToken,
      },
      "user logged in successfully!"
    ));

})


const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token from db
  // remove refresh token from cookies
  // return res
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }

  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
      200,
      {},
      "User logged out successfully",
    ));
});

export { registerUser, loginUser, logoutUser };

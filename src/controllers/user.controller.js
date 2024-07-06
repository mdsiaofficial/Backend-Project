import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
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
});

export { registerUser };
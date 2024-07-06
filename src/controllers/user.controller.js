import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log(req);
  
  res.status(200).json({
    message: "OK!",
  })
});

export { registerUser };
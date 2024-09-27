import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";

import User from "../models/users.models.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import commentController from "./comment.controller.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullname, email, username, password } = req.body;
  //console.log(req.body);
  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    email,
    username,
    password,
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(409, "Something went wrong while creating user");
  }
  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Req.body -> data
  const { email, password, username } = req.body;
  // Username or email
  if (!username && !email) {
    throw new ApiError(400, "username and password is required ");
  }
  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // Password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  // Access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // Send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };

//shireen
// _id: "66efc7a312df6b5fc112f50f",

// post id
// "_id": "66ef03541aabcd5e0f25a537",

//"author_id": "66ef023fb126429a6453aaf1",

//  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmVmYzdhMzEyZGY2YjVmYzExMmY1MGYiLCJlbWFpbCI6InNoaUBnbWFpbGNvbSIsInVzZXJuYW1lIjoic2hpcmVlbkAiLCJpYXQiOjE3MjcwMDMzODgsImV4cCI6MTcyNzA4OTc4OH0.xPz2P3xxhQO1Ovn17iTCj_lT9cseq9Y7Qcwh0ezRxaw",
// "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmVmYzdhMzEyZGY2YjVmYzExMmY1MGYiLCJpYXQiOjE3MjcwMDMzODgsImV4cCI6MTcyNzg2NzM4OH0.ao0OaeNz6vJ93X8a72-8IyeI-5wx06cZ-h2aJ1qGsaM"

//comment
//"_id": "66eff72a1f235e0983825097",

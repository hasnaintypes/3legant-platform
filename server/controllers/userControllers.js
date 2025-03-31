import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import { sendSuccessResponse } from "../utils/successResponse.js";

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { avatar, address, postalCode, city } = req.body;
    const userId = req.user._id;

    // Find user by ID
    let user = await User.findById(userId);
    if (!user) throw new ErrorResponse("User not found", 404);

    // Update user details
    user.avatar = avatar || user.avatar; // Avatar URL comes from frontend
    user.address = address || user.address;
    user.postalCode = postalCode || user.postalCode;
    user.city = city || user.city;

    // Save updated user
    await user.save();

    return sendSuccessResponse(
      res,
      {
        user: {
          _id: user._id,
          avatar: user.avatar,
          address: user.address,
          postalCode: user.postalCode,
          city: user.city,
          role: user.role,
        },
      },
      "Profile updated successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/user/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) throw new ErrorResponse("User not found", 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ErrorResponse("Incorrect old password", 401);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return sendSuccessResponse(res, null, "Password changed successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ErrorResponse("User not found", 404);

    return sendSuccessResponse(
      res,
      { user },
      "User profile fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/user/delete
 * @access  Private
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) throw new ErrorResponse("User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ErrorResponse("Incorrect password", 401);

    await User.deleteOne({ _id: userId });

    return sendSuccessResponse(res, null, "Account deleted successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

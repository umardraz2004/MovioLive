import cloudinary from "../config/cloudinary.js";
import User from "../models/user.js";

export const uploadAvatar = async (req, res) => {
  try {
    const { userId, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new image
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "avatars",
      resource_type: "image",
    });

    // Update avatar field
    user.avatar = {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
    user.markModified("avatar"); // Force mongoose to save nested object
    const savedUser = await user.save();

    res.json({
      message: "Avatar updated successfully",
      avatar: savedUser.avatar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

export const updateUserName = async (req, res) => {
  const { userId } = req.params;
  const { field } = req.params; // e.g. "fullName"
  const { value } = req.body; // send as { value: "newName" }

  try {
    // ✅ whitelist fields for safety
    const allowedFields = ["fullName", "role"];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: value } // dynamic field update
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

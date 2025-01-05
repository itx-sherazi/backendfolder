import User from "../models/users.js";

// Handle profile image upload
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const profileImagePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    return res.json({
      message: "Profile image uploaded successfully",
      profileImage: profileImagePath, // Return the full image path
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({ message: "Error uploading profile image" });
  }
};

// Handle profile update (update the user's profile image)
export const updateProfile = async (req, res) => {
  try {
    const { id, profileImage } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { profileImage }, 
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users." });
  }
};

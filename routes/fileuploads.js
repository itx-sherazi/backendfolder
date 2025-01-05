// import express from "express";
// import multer from "multer";
// import { uploadProfileImage, updateProfile, getAllUsers } from "../controllers/categoryController.js";

// const router = express.Router();

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads"), // Folder path
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 16 }, // 16 MB
//   fileFilter: (req, file, cb) => {
//     const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (validTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only JPEG, PNG, JPG allowed."));
//     }
//   },
// });

// // Route to upload image

// router.post("/upload-image", upload.single("file"), uploadProfileImage);

// // Route to update the user's profile image
// router.put("/update-profile", updateProfile);

// // Route to get all users
// router.get("/users", getAllUsers);

// export default router;
import express from "express";
import multer from "multer";
import { uploadProfileImage, updateProfile, getAllUsers } from "../controllers/categoryController.js";
import path from "path";

// Convert import.meta.url to a file path
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const router = express.Router();

// Serve 'uploads' folder statically
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"), // Folder path
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 16 }, // 16 MB
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, JPG allowed."));
    }
  },
});

// Route to upload image
router.post("/upload-image", upload.single("file"), uploadProfileImage);

// Route to update the user's profile image
router.put("/update-profile", updateProfile);

// Route to get all users
router.get("/users", getAllUsers);

export default router;

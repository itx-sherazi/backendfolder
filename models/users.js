import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { model, Schema, ObjectId } = mongoose;

const userSchema = new Schema(
  { 
    name: {
      type: String,
      maxLength: 200,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      maxLength: 200,
      lowercase: true,
      unique: true,
    },
    verificationCode: {
      type: String,
    },
    username: {
      type: String,
      maxLength: 200,
      trim: true,
      default: null, // You can set a default to null
    },
    password: {
      type: String,
      required: true,
      maxLength: 200,
    },
    profileImage: { type: String, default: null },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: [String],
      enum: ["admin", "buyer", "seller"],
      default: ["buyer"],
    },
    address: { type: String, default: "" },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    wishList: [
      {
        type: ObjectId,
        ref: "Products",
      },
    ],
    resetCode: {},
  },
  { timestamps: true }
);

// Method to compare entered password with stored password
userSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving the user to the database
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(12);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

const User = model("user", userSchema);

export default User;

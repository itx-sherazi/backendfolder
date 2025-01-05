import mongoose from 'mongoose';

const { model, Schema } = mongoose;

// Define Category Schema
const FileSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: false }, // `title` is now optional
    name: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true },
});

const categoryModel = model('Categories', FileSchema);
export default categoryModel;

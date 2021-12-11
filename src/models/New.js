import mongoose from 'mongoose';

const newSchema = new mongoose.Schema(
  {
    thumbnail: String,
    title: String,
    shortContent: String,
    url: String,
    content: String
  },
  { timestamps: true }
);

const New = mongoose.model('New', newSchema);

export { New };

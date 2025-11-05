import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  taxApplicability: {
    type: Boolean,
    default: false,
    set: (v) => v === true || v === "true",
  },
  tax: {
    type: Number,
    default: 0,
  },
  taxType: {
    type: String,
    enum: ["percentage", "fixed"],
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;

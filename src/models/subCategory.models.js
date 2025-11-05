import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  taxApplicability: {
    type: Boolean,
  },
  tax: {
    type: Number,
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;

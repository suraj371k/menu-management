import mongoose from "mongoose";

export const connectDb = () => mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("Error in mongodb connection", err));

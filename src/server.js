import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

//routes imports
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import itemRoutes from "./routes/item.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

//health check
app.get("/", (req, res) => {
  res.send("app is running successfully");
});

//routes
app.use("/api/categories", categoryRoutes);
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/items", itemRoutes);


//database connection
connectDb();

const port = 6000;

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});

import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));

// Routes
import productRoute from "./routes/products.js";
import authRoute from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import stripeRoute from "./routes/Strip.js";
import fileUploadRoute from "./routes/fileuploads.js";

app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", authRoute);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/", fileUploadRoute);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Multi-Vendor API");
});

export default app;

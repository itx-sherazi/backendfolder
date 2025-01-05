// /*-- express start --*/
//  import express from "express";
//  const app = express();
// /*-- express end --*/

// /*-- dotenv start --*/
//  import dotenv from "dotenv";
//  dotenv.config();

//  const port = process.env.PORT || 9000;
// /*-- dotenv end --*/

// /*-- middleware imports start --*/
//  import cors from "cors";
//  import morgan from "morgan";

//  app.use(cors());
//  app.use(express.json({ limit: "50mb" }));  // Increase the limit

//  app.use(morgan("dev"));
//  /*-- middleware imports end --*/

// /* Test the server start */
//  app.get("/api/v1", (req, res) =>{
//       res.send('API is up & running!');
//  });   
//  app.get('/favicon.ico', (req, res) => res.status(204));
// /* Test the server end */

// /* import all routes & pass in middleware */
//  import productRoute from "./routes/products.js";
//  app.use("/api/v1/products", productRoute);

//  import authRoute from "./routes/users.js";
//  app.use("/api/v1/users", authRoute);

//  import orderRoutes from "./routes/orders.js";
//  app.use("/api/v1/orders", orderRoutes);

//  import stripeRoute from "./routes/Strip.js";
//  app.use("/api/stripe", stripeRoute);

//   import adminRoute from "./routes/adminroute.js";
//   app.use("/api/v1/admin", adminRoute);

//   import FileUpload from './routes/fileuploads.js'
// app.use('/',FileUpload)


// /*-- start the server (start)  --*/
//  app.listen(port, ()=>{
//      console.log(`express server is running on http://localhost:${port}/api/v1`);
//  });
// /*-- start the server (end) --*/        

// /*-- DB Connection (start)  --*/
//  import dbconnect from "./config/dbconfig.js";
//  dbconnect();
// /*-- DB Connection (end)  --*/




import { createServer } from "http";
import { parse } from "url";
import dotenv from "dotenv";
import app from "./app.js";
import dbconnect from "./config/dbconfig.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
dbconnect();

// Create and export server
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  app(req, res, parsedUrl);
});

export default server;

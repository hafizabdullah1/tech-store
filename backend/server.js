import express from "express";
import dotenv from "dotenv";
import products from "./Data/products.js";
import connectDB from "./Config/db.js";
import colors from "colors";
import productRoutes from "./Routes/productRoutes.js";
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js";
import userRoutes from './Routes/userRoutes.js';
import orderRoutes from "./Routes/orderRoutes.js";
import path from "path";
import uploadRoutes from "./Routes/uploadRoutes.js";
import morgan from "morgan";


dotenv.config();
const app = express();

if(process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

app.use(express.json());
const PORT = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
  res.send("Api is running......");
});

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound)
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.rainbow
      .bold
  );
});

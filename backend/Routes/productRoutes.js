import express from "express";
import { getProducts, getProductById, deleteProduct, updateProduct, createProduct, createProductReview, getTopProducts } from "../Controllers/productController.js";
import { protect, admin } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);


export default router;

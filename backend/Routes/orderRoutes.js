import { protect } from "../Middleware/authMiddleware.js";
import express from 'express';
import { admin } from "../Middleware/authMiddleware.js";
import { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, getOrders, updateOrderToDelivered } from "../Controllers/orderController.js";

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


export default router;
import { authUsers, getUserProfile, registerUser, updateUserProfile, getUser, deleteUser, getUserById, updateUser } from "../Controllers/userController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

import express from 'express';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUser);
router.post('/login', authUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);


export default router;
import asyncHandler from 'express-async-handler';
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            console.log(token,'token');
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")
            console.log(decoded);
            next()
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }
})

const admin = (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not Authorized as an Admin");
    }
};

export { protect, admin };
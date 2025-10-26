import asyncHandler from "express-async-handler";
import User from '../Models/userModel.js';
import generateToken from "../utils/genarateToken.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";


const authUsers = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password, 'passs');
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(401)
        throw new Error("Invalid email and password")
    };
});

const getUserProfile = (asyncHandler(async (req, res) => {
    // res.send("success")

    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(401);
        throw new Error("user not found");
    };
}));



const registerUser = (asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User Already Exists");
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Invalid User Data");
    }
}))


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {

            user.password = req.body.password || user.password
        }
        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(404)
        throw new Error("User Not Found")
    }
});


// @dec GET ALL USERS
// @route GET /api/users
// access Private/admin

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});


//@dec       Delete User
//@route     Delete /api/users/:id
//@access    Private/admin

const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id)
    if (user) {
        // await user.remove();
        res.send({ message: "User deleted successfully" })
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }
});


//@dec       GET Users by id
//@route     GET /api/users/:id
//@access    Private/admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }
});



const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }
})




export { authUsers, getUserProfile, registerUser, updateUserProfile, getUser, deleteUser, getUserById, updateUser };
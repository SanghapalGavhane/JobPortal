import express from 'express';
import {register,logout,updateProfile,login} from '../controllers/user.js'
import isAuthenticate from '../middlewares/isAuthenticate.js'
import { singleUpload } from '../middlewares/multer.js';

const router=express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticate,updateProfile);
router.route("/logout").get(logout);

export default router
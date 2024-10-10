import express from 'express';
import {getCompany, getCompanyById, registerCompany, updateCompany} from '../controllers/company_controller.js'
import isAuthenticate from '../middlewares/isAuthenticate.js'

const router =express.Router();


router.route("/register").post(isAuthenticate,registerCompany);
router.route("/get").get(isAuthenticate,getCompany);
router.route("/get/:id").get(getCompanyById);
router.route("/update/:id").put(isAuthenticate,updateCompany);

export default router

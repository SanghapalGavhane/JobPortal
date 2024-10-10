import express from 'express';
import isAuthenticate from '../middlewares/isAuthenticate.js'
import {postJob,getAllJobs,getJobById,getAdminJobs} from '../controllers/job_controller.js'

const router= express.Router();

router.route('/post').post(isAuthenticate,postJob);
router.route('/jobs').get(isAuthenticate,getAllJobs);
router.route('/get/:id').get(isAuthenticate,getJobById);
router.route('/getAdminJobs').get(isAuthenticate,getAdminJobs);

export default router;

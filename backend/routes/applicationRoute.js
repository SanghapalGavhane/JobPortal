import express from 'express';
import { updateStatus,getApplicant ,applyJob,getAppliedJobs} from '../controllers/application_controller.js'
import isAuthenticate from '../middlewares/isAuthenticate.js'

const router =express.Router();
router.route('/apply/:id').get(isAuthenticate,applyJob);
router.route('/get').get(isAuthenticate,getAppliedJobs);
router.route('/:id/applicants').get(isAuthenticate,getApplicant,getApplicant)
router.route('/update-status/:id').post(isAuthenticate,updateStatus);




export default router

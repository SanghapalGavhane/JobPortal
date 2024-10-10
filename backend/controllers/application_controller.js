import { Application } from "../models/application.js";
import { Job } from "../models/job.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Please provide job id",
        success: false,
      });
    }
    const appliedBefore = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (appliedBefore) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(200).json({
      message: "Application submitted successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getApplicant = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
export const updateStatus = async (req,res) =>{
    try{
        const {status} =req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message:"Please provide status",
                success:false
            });
        }
        const application = await Application.findOne({_id:applicationId});
        if(!application) {
            return res.status(404).json({
                message:"Application not found",
                success:false
            });
        }
        
        application.status=status.toLowerCase();;
        await application.save();
        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        });

    }catch(err){
        console.log(err);
    }
}
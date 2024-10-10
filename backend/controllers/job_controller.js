import { Job } from "../models/job.js";

export const postJob = async (req,res)=>{
    try{
        const {title,description,requirements,salary,location,jobType,experienceLevel,position,companyId} = req.body;
        const userId =req.id;
        if(!title ||!description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message:"please provide all information ",
                success:false

            });
        };
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company:companyId,
            created_by:userId
        });

        return res.status(201).json({
            message:"new job created successfully",
            job,
            success:true
        })


    }
    catch(err){
        console.log(err);
    }
}

export const getAllJobs = async (req,res) =>{
    try{
        const keyword = req.query.keyword || "";
        const query={
            $or :[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
                
            ]
        };
        const jobs =await Job.find(query).populate({
            path:'company'
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false
                
            });
        };
        return res.status(200).json({
            jobs,
            success:true
        })

    }catch(err){
        console.log(err);
    }
}

export const getJobById = async(req,res) =>{
    try{
        const userId=req.params.id;
        const job = await Job.findById(userId);
        if(!job){
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        };
        return res.status(200).json({
            job,
            success:true
        })
    }catch(err){
        console.log(err);
    }
}

export const getAdminJobs = async (req,res) =>{
    try{
        const adminId=req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        };
        return res.status(200).json({
            jobs,
            success:true
        })

    }catch(err){
        console.log(err);
    }
}
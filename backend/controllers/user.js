import { User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register =async (req,res)=>{
    try{
        const {fullname,email,password,phoneNumber,role}=req.body;
        if(!fullname|| !email|| !password|| !phoneNumber || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"user already exist with this email",
                success:false
            });
        };
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        });

        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })

    }catch(err){
        console.log(err);

    }
}

export const login = async(req,res)=>{
    try{
        const {email,password,role}=req.body;
        if( !email|| !password|| !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"incorrect email",
                success:false
            });
        };
        const isPasswoedMatch=await bcrypt.compare(password,user.password);
        if(!isPasswoedMatch){
            return res.status(400).json({
                message:"incorrect password",
                success:false
            });
        };
        if(role != user.role){
            return res.status(400).json({
                message:"Account does not exist with this role",
                success:false
            })
        }
        const tokenData={
            userId:user._id
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
        
         user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile

         }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`welcome back ${user.fullname}`,
            user,
            success:true
        })

    }catch(err){
        console.log(err)

    }
}

export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successfully",
            success:true

        });

        }catch(err){
            console.log(err);

        }
       
}

export const updateProfile = async(req,res)=>{
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        const file=req.file;

        let skillsArray;
        if(skills){
            skillsArray=skills.split(",");
        }
       
        
        const userId=req.id;

        let user=await User.findById(userId);

        if(!user){
            return res.status(400).json({
               message:"user not found",
               success:false 
            });
        }

        if(fullname) user.fullname=fulname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber=phoneNumber;
        if(bio) user.profile.bio=bio;
        if(skills) user.profile.skills=skillsArray;

        
        // user.email=email;
        // user.phoneNumber=phoneNumber;
        // user.profile.bio=bio;
        // user.profile.skills=skillsArray;

        await user.save();

        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile

         }
         
         return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
         })


    }catch(err){
        console.log(err);
        
    }
}

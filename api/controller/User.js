import User from "../model/User.js"
import datauri from 'datauri/parser.js';
import cloud from 'cloudinary'
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt"
import { createError } from "../util/error.js";
import fs from "fs"

const parser=new datauri()


dotenv.config();
const cloudinary = cloud.v2
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    secure: true
});


console.log(cloudinary.config());

export const Register=async (req,res,next)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newuser=new User({
            ...req.body,
            password:hash
        })
        const saveduser=await newuser.save()
        res.status(200).json(saveduser)
    }catch(err){
        next(err)
    }
}
export const login=async (req,res,next)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        if(!user) return next(createError(404,"user not found"))
        const passwordcorrect=await bcrypt.compare(req.body.password, user.password)
        if(!passwordcorrect)
        return next(createError(400,"password is not correct"))
        const {password,isAdmin,...other}=user._doc
        res.status(200).json({details:{...other},isAdmin})
    }catch(err){
        next(err)
    }
}
export const getuser=async (req,res,next)=>{
    try{
        const user=await User.find({_id:req.params.id})
        res.status(200).json(user)
    }
    catch(err){
        next(err)
    }
}
export const updateCoordinates=async(req,res,next)=>{
    try{
        const user=await User.updateOne({_id:req.params.id},{$set:{"coordinates":req.body.coordinates}});
        res.status(200).json(user)
    }catch(err){
        next(err)
    }
}
export const notifications=async(req,res,next)=>{
    try{
        const user=await User.updateOne({_id:req.params.id},{$set:{"notifications":req.body.notifications}});
        res.status(200).json(user)
    }catch(err){
        next(err)
    }
}
export const uploadImage = async (req,res,next) => {

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const extname=path.extname(req.files.file.name).toString()
      const file64=parser.format(extname,req.files.file.data)
      const result = await cloudinary.uploader.upload(file64.content, options);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newuser=new User({
          ...req.body,
          password:hash,
          profileImg:result.secure_url
      })
      const saveduser=await newuser.save()
      res.status(200).json(saveduser)
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
};

import { JsonWebTokenError } from "jsonwebtoken"
import { createError } from "./error"

const verify=(req,res,next)=>{
 const token=req.cookie.access_token
 if(!token){return next(createError(401,"You are not authenticated"))}
 jwt.verify(token,process.env.SecretKey,(err,user)=>{
    if(err)return next(createError(403,"Token is not valid"))
    req.user=user;
    next();
 });
};
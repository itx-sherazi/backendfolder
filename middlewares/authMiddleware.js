import jwt from 'jsonwebtoken';
import * as config from "../config/config.js";
import asyncHandler from "express-async-handler";

export const requiredLoggedIn =  asyncHandler( (req, res, next) => {

    const authToken = req.headers.authorization
    if(authToken){    
        const decoded = jwt.verify(authToken, config.JWT_SECRET );  
        req.user = decoded;
        next();
    } else {
        res.json({ error: 'Unauthorized: No token/Invalid provided.' });
    }


});

export const checkAdmin = asyncHandler (( req, res, next) => {

    if(req.user && req.user.isAdmin){
        next();
    } else {
        res.json({ error: 'You dont have access for this for page' });
        throw new Error('You dont have access for this for page')
    }


})


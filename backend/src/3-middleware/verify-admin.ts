import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import { UnauthorizedErrorModel } from "../4-models/error-models";

async function verifyAdmin(request: Request, response: Response, next: NextFunction) {
    try {
        //check if user role is admin
        const isAdmin = await cyber.verifyAdmin(request);

        //if not- throw error
        if (!isAdmin) throw new UnauthorizedErrorModel("You are not admin");
        
        // transfer flow to next middleware or to controller 
        next();
    }
    catch (err: any) {
        next(err);
    }
}

export default verifyAdmin;
import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import { UnauthorizedErrorModel } from "../4-models/error-models";

async function verifyLoggedIn(request: Request, response: Response, next: NextFunction) {
    try {
        // check if there is a user logged in
        const isValid = await cyber.verifyToken(request);

        // if not- throw error
        if (!isValid) throw new UnauthorizedErrorModel("Invalid token");

        // transfer flow to next middleware or to controller 
        next();
    }
    catch (err: any) {
        next(err);
    }
}

export default verifyLoggedIn;
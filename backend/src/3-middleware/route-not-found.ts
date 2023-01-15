import { NextFunction, Request, Response } from "express";
import { RouteNotFoundErrorModel } from "../4-models/error-models";

function routeNotFound(request: Request, response: Response, next: NextFunction) {

    const err = new RouteNotFoundErrorModel(request.originalUrl);

    // transfer flow to next middleware or to controller 
    next(err);
}

export default routeNotFound;

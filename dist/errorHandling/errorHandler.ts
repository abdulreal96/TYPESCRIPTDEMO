import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const errorHandlerMiddleware =async (err:Error, req:Request, res:Response, next:NextFunction) => {

    if (err instanceof CustomError) 
        return res.status(err.status).json({ msg: err.message });
   
        // Handle other types of errors or use a default status code
        return res.status(500).json({ msg: 'Internal Server Error' });
    
}
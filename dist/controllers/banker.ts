import { Request, Response } from 'express';
import { Banker } from '../entities/Banker';

export const createBanker = async (req: Request, res: Response): Promise<void> => {
    
    const {
        firstName,
        lastName,
        email,
        employeeNumber
    } = req.body;

    const banker = Banker.create({
        first_name: firstName,
        last_name: lastName,
        email,
        employee_number: employeeNumber
    });

    await banker.save();
    
    res.json(banker);
};

export const getBanker = async (req: Request, res: Response): Promise<void> => {
    res.send("Hello");
};

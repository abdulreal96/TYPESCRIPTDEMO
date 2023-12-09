import { NextFunction, Request, Response } from 'express';
import { Clients } from '../entities/Clients';
import { Transaction, TransactionType } from '../entities/Transaction';
import { createQueryBuilder } from 'typeorm';
import { CustomError } from '../errorHandling/errorHandler'
import { ValidationChain, body, validationResult } from 'express-validator';

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
 
     // Validation rules using express-validator
    const validationRules: ValidationChain[] = [
        body('firstName')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name should be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s']+$/)
        .withMessage("First name should contain only alphabetic characters and ' (single quote)"),

        body('lastName')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name should be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s']+$/)
        .withMessage("Last name should contain only alphabetic characters and ' (single quote)"),

        body('email').isEmail().withMessage('Invalid email').isLength({ max: 100 }),
        
        body('cardNumber').isLength({ min: 10, max: 10 }).withMessage('Card number is required and should be 10 characters').isNumeric(),

        body('balance').isLength({ min: 0 }).withMessage('Balance should be a number and not be less than 0').isNumeric(),
    ];

    // Check for validation errors
    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        const errorMessages = errors.map(error => error.msg);
        return res.status(400).json({ ...errorMessages });
    }

    const {
        firstName,
        lastName,
        email,
        cardNumber,
        balance,
    } = req.body;

    const existingClient = await createQueryBuilder('clients')
        .where('clients.email = :email OR clients.card_number = :cardNumber', { email, cardNumber })
        .getOne();

    if (existingClient) 
        return next(new CustomError('Client with email or card number already exists', 400));

    const client = Clients.create({
        first_name: firstName,
        last_name: lastName,
        email,
        card_number: cardNumber,
        balance
    });

    await client.save();


    const newClient = {
        id: client.id, 
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        card_number: client.card_number,
        balance: client.balance,
        additional_info: client.additional_info,
        family_members: client.family_members,
        is_active: client.is_active,
        created_at: client.created_at,
        updated_at: client.updated_at
    };
    
    return res.status(201).json({client: newClient});
};

export const getClient = async (req: Request, res: Response, next: NextFunction) => {

    const {clientId} = req.params;

    const client = await Clients.findOne({where: {id: parseInt(clientId)}});

    if(!client)
        return next(new CustomError('Client not found', 404));

    res.status(200).json({client});
};

//get client using sql query 
export const getClients = async (req: Request, res: Response): Promise<void> => {

    const clients = await Clients.find();

    res.status(200).json({clients});

    // try {
    //         const client = await createQueryBuilder()
    //             .select('clients.first_name')
    //             .addSelect('clients.last_name')
    //             .from(Clients, 'clients')
    //             .where('clients.id = :clientId', { clientId: 2 })
    //             .getOne();
        
    //         res.send(client);

    // } catch (error) {
    //     res.status(500).send('Error fetching client');
    // }
};


export const updateClient = async (req: Request, res: Response, next: NextFunction) => {

    const { clientId } = req.params;

    const existingClient = await Clients.findOne({ where: { id: parseInt(clientId) } });

    if (!existingClient) {
        return next(new CustomError('Client not found', 404));
    }

     // Validation rules using express-validator
     const validationRules: ValidationChain[] = [
        body('firstName')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name should be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s']+$/)
        .withMessage("First name should contain only alphabetic characters and ' (single quote)"),

        body('lastName')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name should be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s']+$/)
        .withMessage("Last name should contain only alphabetic characters and ' (single quote)"),

        body('email').isEmail().withMessage('Invalid email').isLength({ max: 100 }),
        
        body('cardNumber').isLength({ min: 10, max: 10 }).withMessage('Card number is required and should be 10 characters').isNumeric(),
    ];

    // Check for validation errors
    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        const errorMessages = errors.map(error => error.msg);
        return res.status(400).json({ ...errorMessages });
    }

    const {
        firstName,
        lastName,
        email,
        cardNumber,
    } = req.body;

    const verifyClient = await createQueryBuilder('clients')
    .where('clients.id != :clientId AND (clients.email = :email OR clients.card_number = :cardNumber)', { clientId, email, cardNumber })
    .getOne();

    if (verifyClient) {
        return next(new CustomError('Client with email or card number already exists', 400));
    }

    existingClient.first_name = firstName;
    existingClient.last_name = lastName;
    existingClient.email = email;
    existingClient.card_number = cardNumber;

    await existingClient.save();

    const updatedClient = {
        id: existingClient.id,
        first_name: existingClient.first_name,
        last_name: existingClient.last_name,
        email: existingClient.email,
        card_number: existingClient.card_number,
        balance: existingClient.balance,
        additional_info: existingClient.additional_info,
        family_members: existingClient.family_members,
        is_active: existingClient.is_active,
        created_at: existingClient.created_at,
        updated_at: existingClient.updated_at
    };

    return res.status(200).json({ client: updatedClient });
};


export const deleteClient = async (req: Request, res: Response) => {
    
    const {clientId} = req.params;

    const client = await Clients.delete(parseInt(clientId));
    
    return res.send(client);
};


export const transaction = async (req: Request, res: Response) => {
    
    const { clientId } = req.params;

    const { type, amount  } = req.body;

    const client = await Clients.findOne({ where: { id: parseInt(clientId) } });

    if(!client)
        return res.json({msg : "client not found"});
    
    const transaction = Transaction.create({
        amount,
        type,
        client
    })

    await transaction.save();

    if(type === TransactionType.DEPOSIT)
        client.balance = client.balance + amount;
    else if(type === TransactionType.WITHDRAW)
        client.balance = client.balance - amount
    
    await client.save();
    
    return res.json({msg : "Transaction successful"});
};

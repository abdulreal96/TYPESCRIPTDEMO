import { Request, Response } from 'express';
import { Transaction, TransactionType } from '../entities/Transaction';
import { Clients } from '../entities/Clients';

export const withdraw = async (req: Request, res: Response) => {
    
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

    if(type === TransactionType.DEPOSIT)
        client.balance = client.balance + amount;
    else if(type === TransactionType.WITHDRAW)
        client.balance = client.balance - amount
    
    await transaction.save();
    
    return res.json({msg : "Transaction successful"});
};

export const getClients = async (req: Request, res: Response): Promise<void> => {
    res.send("Hello");
};

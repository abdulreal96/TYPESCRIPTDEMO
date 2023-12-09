import { Request, Response } from 'express';
import { Banker } from '../entities/Banker';
import { Clients } from '../entities/Clients';

export const connectBankerToClient = async (req: Request, res: Response) => {
    
    const {bankerId, clientId} = req.params;

    const banker = await Banker.findOne({where: { id: parseInt(bankerId)}});

    const client = await Clients.findOne({where: { id: parseInt(clientId)}});

    if(!banker || !client)
        return res.json({msg: "Banker or Client not found"});


    banker.clients = [client]

    await banker.save();
    
    return res.json({msg: "Banker connect to Client"});
};


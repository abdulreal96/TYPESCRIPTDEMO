import { getClients, createClient, transaction, deleteClient, getClient, updateClient } from "../controllers/clients";
import express from "express";

const router = express.Router();

router.route('/').get(getClients).post(createClient);
router.route('/:clientId').get(getClient).delete(deleteClient).patch(updateClient);
router.route('/:clientId/transaction').post(transaction);



export {
    router as clientRouter
}
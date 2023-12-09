import { getClients, withdraw } from "../controllers/transaction";
import express from "express";


const router = express.Router();

router.route('/').get(getClients).post(createClients);



export {
    router as clientRouter
}
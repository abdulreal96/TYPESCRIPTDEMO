import { connectBankerToClient } from "../controllers/connectBankerToClient";
import express from "express";


const router = express.Router();

router.route('/banker/:bankerId/client/:clientId').put(connectBankerToClient);



export {
    router as connectBankerToClientRouter
}
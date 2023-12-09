import { getBanker, createBanker } from "../controllers/banker";
import express from "express";


const router = express.Router();

router.route('/').get(getBanker).post(createBanker);



export {
    router as bankerRouter
}
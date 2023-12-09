import { createConnection, createConnections } from "typeorm";
import * as dotenv from "dotenv";
import {Clients} from "./entities/Clients";
import { Banker } from "./entities/Banker";
import { Transaction } from "./entities/Transaction";
import express from "express";
import { clientRouter } from "./routes/clients";
import { bankerRouter } from "./routes/banker";
import { connectBankerToClientRouter } from "./routes/connectBankerToClient";
import "express-async-errors";
import { errorHandlerMiddleware } from "./errorHandling/errorHandler"
import { limiter } from "./middlewares/rateLImiteMiddleware"

const app = express();


// Load environment variables from .env file
dotenv.config();
const connectDB = async () => {
    try{
        await createConnection({

            type: process.env.DB_TYPE as any,
            host: process.env.DB_HOST as any,
            port: process.env.DB_PORT as any,
            username: process.env.DB_USERNAME as any,
            password: process.env.DB_PASSWORD as any,
            database: process.env.DB_NAME as any,
            entities: [Clients, Banker, Transaction],
            synchronize: true

        });

        app.listen(3000, () => {
            console.log("Server now running on port 3000");
        });

        app.use(limiter);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/api/v1/clients", clientRouter);
        app.use("/api/v1/bankers", bankerRouter);
        app.use("/api/v1/", connectBankerToClientRouter);

        app.use(errorHandlerMiddleware);


        console.log("Connected to Database");
    }catch (error){
        console.error("Unable to connect to Database");
        console.error(error);
    }
}

connectDB();
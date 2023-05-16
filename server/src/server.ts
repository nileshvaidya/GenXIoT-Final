
require("dotenv").config({
    path: `./.env.${process.env.NODE_ENV}`,
    // path: './.env.development.local',
  });

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config, DB } from './config';
import configuration from 'config';
import { ServerSocket } from './socket';
// import { Server } from 'socket.io';
import mqttclient from './mqttclient';
import Logging from './library/Logging';
import deviceRoutes from './routes/Device';
import deviceDataRoutes from './routes/DeviceData';
import bodyParser from 'body-parser';
import { log } from 'console';
const connectToDB = require('./db/db');
import cors from 'cors';

const port = process.env.SERVER_PORT;
// const port = config.server.port;
const host = config.server.host;
const mongo_url = 'mongodb://127.0.0.1:27017/genxiot'
//const mongo_url = 'mongodb://0.0.0.0:27017/genxiot';//?authSource=admin';// config.mongo.url //+ "/"+ config.mongo.db_name;
const corsOrigin = configuration.get<string>('corsOrigin');

const whitelist = ['http://localhost:3000']
// const corsOptions = {
//   origin: (origin: string, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error(),false)
//     }
//   }
// }



const router = express();


router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: false }));
const options = {
    dbName: 'genxiot',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
};
let dbConnected
// Connect to MongoDB
const  connectDB = async () => {
    console.log('connecting to mongodb...');
    const DB_HOST = process.env.DB_HOST||'mongo';
    const DB_PORT = process.env.DB_PORT||27017;
    const DB_NAME = process.env.DB_NAME||'genxiot';
    const DB_USER = process.env.DB_USER||'local_user';
    const DB_PASSWORD = process.env.DB_PASSWORD||'Password123';
    
    const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    console.log(DB_URL);
    
    try {
        await mongoose.connect(DB_URL, {})

      
        dbConnected = true;
        console.log('MongoDB Connected')
        StartServer();
        
    }
    catch (err) { console.log(err) };
  }
  
//   setTimeout(() => {
//     console.log('Connect to MongoDB.');
//     connectDB();
//   }, 10000);
  
connectDB();

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });
    // StartServer();
    // router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, UPDATE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

        next();
    });
    /** Routes */


    router.use(
        cors({
            allowedHeaders: "*",
            methods: "*",
            origin: "*",
            maxAge: 60 ,
        })
    );
    router.use('/api/devices',  deviceRoutes);
    router.use('/api/devicedata',  deviceDataRoutes);

    /** Healthcheck */
    router.get('/api/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        Logging.warning(`URL : ${req.url}`);
        const error = new Error('Route Not found');

        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    const httpServer = http.createServer(router);

    /** Start Socket */
    new ServerSocket(httpServer);

    httpServer.listen(port,  () => {
        Logging.info(`\nServer is running ${port}`);
       
        mqttclient();
        
    });
};
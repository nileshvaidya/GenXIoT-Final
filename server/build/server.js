"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({
    path: "./.env.".concat(process.env.NODE_ENV),
    // path: './.env.development.local',
});
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = require("./config");
var config_2 = __importDefault(require("config"));
var socket_1 = require("./socket");
// import { Server } from 'socket.io';
var mqttclient_1 = __importDefault(require("./mqttclient"));
var Logging_1 = __importDefault(require("./library/Logging"));
var Device_1 = __importDefault(require("./routes/Device"));
var DeviceData_1 = __importDefault(require("./routes/DeviceData"));
var body_parser_1 = __importDefault(require("body-parser"));
var connectToDB = require('./db/db');
var cors_1 = __importDefault(require("cors"));
var port = process.env.SERVER_PORT;
// const port = config.server.port;
var host = config_1.config.server.host;
var mongo_url = 'mongodb://127.0.0.1:27017/genxiot';
//const mongo_url = 'mongodb://0.0.0.0:27017/genxiot';//?authSource=admin';// config.mongo.url //+ "/"+ config.mongo.db_name;
var corsOrigin = config_2.default.get('corsOrigin');
var whitelist = ['http://localhost:3000'];
// const corsOptions = {
//   origin: (origin: string, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error(),false)
//     }
//   }
// }
var router = (0, express_1.default)();
router.set('view engine', 'ejs');
router.use(body_parser_1.default.urlencoded({ extended: false }));
var options = {
    dbName: 'genxiot',
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
var dbConnected;
// Connect to MongoDB
var connectDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_URL, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('connecting to mongodb...');
                DB_HOST = process.env.DB_HOST || 'mongo';
                DB_PORT = process.env.DB_PORT || 27017;
                DB_NAME = process.env.DB_NAME || 'genxiot';
                DB_USER = process.env.DB_USER || 'local_user';
                DB_PASSWORD = process.env.DB_PASSWORD || 'Password123';
                DB_URL = "mongodb://".concat(DB_USER, ":").concat(DB_PASSWORD, "@").concat(DB_HOST, ":").concat(DB_PORT, "/").concat(DB_NAME);
                console.log(DB_URL);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, mongoose_1.default.connect(DB_URL, {})];
            case 2:
                _a.sent();
                dbConnected = true;
                console.log('MongoDB Connected');
                StartServer();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4:
                ;
                return [2 /*return*/];
        }
    });
}); };
//   setTimeout(() => {
//     console.log('Connect to MongoDB.');
//     connectDB();
//   }, 10000);
connectDB();
/** Only Start Server if Mongoose Connects */
var StartServer = function () {
    /** Log the request */
    router.use(function (req, res, next) {
        /** Log the req */
        Logging_1.default.info("Incomming - METHOD: [".concat(req.method, "] - URL: [").concat(req.url, "] - IP: [").concat(req.socket.remoteAddress, "]"));
        res.on('finish', function () {
            /** Log the res */
            Logging_1.default.info("Result - METHOD: [".concat(req.method, "] - URL: [").concat(req.url, "] - IP: [").concat(req.socket.remoteAddress, "] - STATUS: [").concat(res.statusCode, "]"));
        });
        next();
    });
    // StartServer();
    // router.use(express.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    /** Rules of our API */
    router.use(function (req, res, next) {
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, UPDATE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });
    /** Routes */
    router.use((0, cors_1.default)({
        allowedHeaders: "*",
        methods: "*",
        origin: "*",
        maxAge: 60,
    }));
    router.use('/api/devices', Device_1.default);
    router.use('/api/devicedata', DeviceData_1.default);
    /** Healthcheck */
    router.get('/api/ping', function (req, res, next) { return res.status(200).json({ message: 'pong' }); });
    /** Error handling */
    router.use(function (req, res, next) {
        Logging_1.default.warning("URL : ".concat(req.url));
        var error = new Error('Route Not found');
        Logging_1.default.error(error);
        res.status(404).json({
            message: error.message
        });
    });
    var httpServer = http_1.default.createServer(router);
    /** Start Socket */
    new socket_1.ServerSocket(httpServer);
    httpServer.listen(port, function () {
        Logging_1.default.info("\nServer is running ".concat(port));
        (0, mqttclient_1.default)();
    });
};

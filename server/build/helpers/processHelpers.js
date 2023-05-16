"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.processIncomingData = void 0;
// import { logger } from 'pino';
//import { getClientCode, updateTimeStamp } from './../db/DevicesDB';
var logging_1 = __importDefault(require("../utils/logging"));
//import mongoose from 'mongoose';
var DevicesDB_1 = require("../db/DevicesDB");
var moment_1 = __importDefault(require("moment"));
var socket_1 = require("../socket");
// import { sendWhatsAppMsg } from '../utils/sendWhatsApp';
var sendTelegram_1 = require("../utils/sendTelegram");
var logEvents = require('./logEvents');
var EventEmitter = require('events');
var Emitter = /** @class */ (function (_super) {
    __extends(Emitter, _super);
    function Emitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Emitter;
}(EventEmitter));
;
var myEmitter = new Emitter();
var clientMobile = '+919987585913';
myEmitter.on('alarms', function (msg, fileName) { return logEvents(msg, fileName); });
myEmitter.on('alerts', function (msg, fileName) { return logEvents(msg, fileName); });
var extractTimeStamp = function (data) {
    var json = JSON.parse(data);
    var ts = json.timestamp;
    var dateTime = (0, moment_1.default)(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');
    // Logger.info('extractTimestamp', 'Time Stamp', dateTime);
    return dateTime;
};
var FormClientMessage = function (deviceId, lastUpdated) {
    var jsonObj = {
        deviceId: deviceId,
        lastUpdated: lastUpdated
    };
    return JSON.stringify(jsonObj);
};
var processIncomingData = function (topic, message) { return __awaiter(void 0, void 0, void 0, function () {
    var ObjectId, v, device_id, clientCode, tsData, dataTimeStamp, str, deviceData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ObjectId = require('mongodb').ObjectId;
                v = topic.split('/');
                if (!(v[0] === 'askdevicedata')) return [3 /*break*/, 2];
                device_id = v[1];
                return [4 /*yield*/, (0, DevicesDB_1.getClientCodeFromDeviceId)(device_id)];
            case 1:
                clientCode = _a.sent();
                /** UnComment when Data from Device needs to be saved. Commented for development */
                if (!clientCode) {
                    clientCode = "SBF0001";
                }
                tsData = extractTimeStamp(message);
                // console.log("device_id : ", device_id, "tsData :", tsData);
                (0, DevicesDB_1.updateTimeStamp)(device_id, tsData);
                dataTimeStamp = {};
                str = '{"' + device_id + '":"' + tsData + '"}';
                // Logger.info('ProcessHelper', 'TimeStamp string : ', str);
                dataTimeStamp = JSON.parse(str);
                deviceData = JSON.parse(message);
                // console.log("Data Received : ", deviceData);
                CheckForAlarm(clientCode, device_id, deviceData);
                socket_1.ServerSocket.PrepareMessage(clientCode, device_id, dataTimeStamp, JSON.parse(message));
                return [2 /*return*/, clientCode];
            case 2: return [2 /*return*/, ''];
        }
    });
}); };
exports.processIncomingData = processIncomingData;
var CheckForAlarm = function (clientCode, deviceId, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceTemp, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, DevicesDB_1.getDevicesById)(clientCode, deviceId)];
            case 1:
                deviceTemp = _a.sent();
                //console.log("deviceTemp : ", deviceTemp);
                if (deviceTemp !== null) {
                    device = deviceTemp;
                    // console.log("device in alarm : ", device);
                    CheckAnalogParams(device, deviceData);
                    CheckDigitalParams(device, deviceData);
                }
                return [2 /*return*/];
        }
    });
}); };
var CheckAnalogParams = function (device, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var analogParams, an_param_array_1, dd_objects, val_1, _loop_1, i;
    return __generator(this, function (_a) {
        try {
            analogParams = device.analog_params;
            an_param_array_1 = Object.values(analogParams);
            dd_objects = Object.keys(deviceData);
            _loop_1 = function (i) {
                dd_objects.map(function (key) {
                    if (an_param_array_1[i].an_name === key) {
                        val_1 = deviceData[key];
                        if (an_param_array_1[i].alert_on_high) {
                            if (parseInt(val_1) > an_param_array_1[i].high_alert_value.valueOf()) {
                                myEmitter.emit('alerts', "Param ".concat(an_param_array_1[i].an_name.toString(), " Value : ").concat(val_1, " is greater than High Alert Value which is ").concat(an_param_array_1[i].high_alert_value.valueOf(), " "), 'alerts.txt');
                                logging_1.default.warn('ProcessHelper', 'Check Alarm', "Alert Received...");
                                // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'high', an_param_array[i].high_alert_value.valueOf());
                                // return;
                                (0, sendTelegram_1.sendTelegramMsg)(clientMobile, 'analog', an_param_array_1[i].an_name.toString(), 'alerts', val_1, 'high', an_param_array_1[i].high_alert_value.valueOf());
                                return;
                            }
                        }
                        if (an_param_array_1[i].alarm_on_high) {
                            if (parseInt(val_1) > an_param_array_1[i].high_alarm_value.valueOf()) {
                                myEmitter.emit('alarms', "Param ".concat(an_param_array_1[i].an_name.toString(), " Value : ").concat(val_1, " is greater than High Alarm Value which is ").concat(an_param_array_1[i].high_alarm_value.valueOf(), " "), 'alarms.txt');
                                logging_1.default.warn('ProcessHelper', 'Check Alarm', "Alarm Received...");
                                (0, sendTelegram_1.sendTelegramMsg)(clientMobile, 'analog', an_param_array_1[i].an_name.toString(), 'alarms', val_1, 'high', an_param_array_1[i].high_alarm_value.valueOf());
                                return;
                                // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'high', an_param_array[i].high_alarm_value.valueOf());
                                // return;
                            }
                        }
                        if (an_param_array_1[i].low_alert_value) {
                            if (parseInt(val_1) < an_param_array_1[i].low_alert_value.valueOf()) {
                                myEmitter.emit('alerts', "Param ".concat(an_param_array_1[i].an_name.toString(), " Value : ").concat(val_1, " is lower than Low Alert Value which is ").concat(an_param_array_1[i].low_alert_value.valueOf(), " "), 'alerts.txt');
                                logging_1.default.warn('ProcessHelper', 'Check Alarm', "Alert Received...");
                                (0, sendTelegram_1.sendTelegramMsg)(clientMobile, 'analog', an_param_array_1[i].an_name.toString(), 'alerts', val_1, 'low', an_param_array_1[i].low_alert_value.valueOf());
                                return;
                                // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'low', an_param_array[i].low_alert_value.valueOf());
                                // return;
                            }
                        }
                        if (an_param_array_1[i].low_alarm_value) {
                            if (parseInt(val_1) < an_param_array_1[i].low_alarm_value.valueOf()) {
                                myEmitter.emit('alarms', "Param ".concat(an_param_array_1[i].an_name.toString(), " Value : ").concat(val_1, " is lower than Low Alarm Value which is ").concat(an_param_array_1[i].low_alarm_value.valueOf(), " "), 'alarms.txt');
                                logging_1.default.warn('ProcessHelper', 'Check Alarm', "Alarm Received...");
                                (0, sendTelegram_1.sendTelegramMsg)(clientMobile, 'analog', an_param_array_1[i].an_name.toString(), 'alarms', val_1, 'low', an_param_array_1[i].low_alarm_value.valueOf());
                                return;
                                // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'low', an_param_array[i].low_alarm_value.valueOf());
                                // return;
                            }
                        }
                    }
                });
            };
            for (i = 0; i < an_param_array_1.length; i++) {
                _loop_1(i);
            }
        }
        catch (error) {
            console.log(error);
        }
        return [2 /*return*/];
    });
}); };
var CheckDigitalParams = function (device, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var digitalParams, di_param_array_1, dd_objects_1, val_2, _loop_2, i;
    return __generator(this, function (_a) {
        try {
            digitalParams = device.digital_params;
            di_param_array_1 = Object.values(digitalParams);
            dd_objects_1 = Object.keys(deviceData);
            _loop_2 = function (i) {
                dd_objects_1.map(function (key) {
                    if (di_param_array_1[i].di_name === key) {
                        val_2 = deviceData[key];
                        if (di_param_array_1[i].alert_on_high) {
                            var val_3;
                            var _loop_3 = function (i_1) {
                                dd_objects_1.map(function (key) {
                                    if (di_param_array_1[i_1].di_name === key) {
                                        val_3 = deviceData[key];
                                        console.log("val : ", val_3);
                                        if (di_param_array_1[i_1].alert_on_high) {
                                            if (Boolean(val_3)) {
                                                myEmitter.emit('alerts', "Param ".concat(di_param_array_1[i_1].di_name.toString(), " Value : ").concat(val_3, " is High and this Param is set for Alert on High"), 'DI alerts.txt');
                                                logging_1.default.warn('ProcessHelper', 'Check Digital Alarm', "Alert Received...");
                                                // sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alerts', 1, 'high',1);
                                                return;
                                            }
                                        }
                                        if (di_param_array_1[i_1].alarm_on_high) {
                                            if (Boolean(val_3)) {
                                                myEmitter.emit('alarms', "Param ".concat(di_param_array_1[i_1].di_name.toString(), " Value : ").concat(val_3, " is High and this Param is set for Alarm on High"), 'DI alarms.txt');
                                                logging_1.default.warn('ProcessHelper', 'Check Digital Alarm', "Alarm Received...");
                                                // sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alarms', 1, 'high',1);
                                                return;
                                            }
                                        }
                                        if (di_param_array_1[i_1].alert_on_low) {
                                            if (!Boolean(val_3)) {
                                                myEmitter.emit('alerts', "Param ".concat(di_param_array_1[i_1].di_name.toString(), " Value : ").concat(val_3, " is Low and this Param is set for Alert on Low"), 'DI alerts.txt');
                                                logging_1.default.warn('ProcessHelper', 'Check Digital Alarm', "Alerts Received...");
                                                // sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alerts', 0, 'low',0);
                                                return;
                                            }
                                        }
                                        if (di_param_array_1[i_1].alarm_on_low) {
                                            if (!Boolean(val_3)) {
                                                myEmitter.emit('alarms', "Param ".concat(di_param_array_1[i_1].di_name.toString(), " Value : ").concat(val_3, " is Low and this Param is set for Alarm on Low"), 'DI alarms.txt');
                                                logging_1.default.warn('ProcessHelper', 'Check Digital Alarm', "Alarms Received...");
                                                // sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alarms', 0, 'low',0);
                                                return;
                                            }
                                        }
                                    }
                                });
                            };
                            for (var i_1 = 0; i_1 < di_param_array_1.length; i_1++) {
                                _loop_3(i_1);
                            }
                        }
                    }
                });
            };
            for (i = 0; i < di_param_array_1.length; i++) {
                _loop_2(i);
            }
        }
        catch (error) {
            console.log(error);
        }
        return [2 /*return*/];
    });
}); };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSocket = void 0;
var socket_io_1 = require("socket.io");
var uuid_1 = require("uuid");
var val = JSON.stringify({
    SK: 'RRRST778',
    DID: '8876859487',
    V1: 205,
    V1_R: 'N',
    V2: 181,
    V2_R: 'N',
    V3: 186,
    V3_R: 'N',
    I1: 55,
    I1_R: 'N',
    I2: 78,
    I2_R: 'N',
    I3: 3,
    I3_R: 'N',
    PF1: 1.1205595136319317,
    PF_R: 'N',
    PF2: 1.6569708173880913,
    PF3: 1.2079522031413057,
    FREQ: 51.968457185081384,
    FREQ_R: 'N',
    MkWh: 293,
    MkWh_R: 'N',
    D0: 0,
    D0_R: 'N',
    D1: 1,
    D1_R: 'N',
    D2: 1,
    D2_R: 'N',
    D3: 1,
    D3_R: 'N',
    D4: 0,
    D4_R: 'N',
    D5: 0,
    D5_R: 'N',
    timestamp: 1663219902
});
var ServerSocket = /** @class */ (function () {
    function ServerSocket(server) {
        var _this = this;
        this.StartListeners = function (socket) {
            // console.info('Message received from ' + socket.id);
            socket.on('handshake', function (callback) {
                console.info('Handshake received from ' + socket.id);
                /**Check if this is a reconnection */
                var reconnected = Object.values(_this.users).includes(socket.id);
                if (reconnected) {
                    console.info('This user has reconnected.');
                    var uid_1 = _this.GetUidFromSocketId(socket.id);
                    var users_1 = Object.values(_this.users);
                    if (uid_1) {
                        console.info('Sending callback for reconnect...');
                        callback(uid_1, users_1);
                        return;
                    }
                }
                /** Generate new user*/
                var uid = (0, uuid_1.v4)();
                _this.users[uid] = socket.id;
                var users = Object.values(_this.users);
                console.info('Sending callback for handshake...');
                callback(uid, users);
                /** Send new user to all connected users */
                ServerSocket.SendMessage('user_connected', users.filter(function (id) { return id !== socket.id; }), users);
            });
            socket.on('disconnect', function () {
                console.info('Disconnect received from ' + socket.id);
                var uid = _this.GetUidFromSocketId(socket.id);
                if (uid) {
                    delete _this.users[uid];
                    var users = Object.values(_this.users);
                    ServerSocket.SendMessage('user_disconnected', users, uid);
                }
                var cid = _this.GetCidFromSocketId(socket.id);
                if (cid) {
                    delete ServerSocket.clients[cid];
                    var clients = Object.values(ServerSocket.clients);
                    //this.SendMessage('user_disconnected', users, uid);
                    console.log(ServerSocket.clients);
                }
            });
            socket.on('add_client', function (cid) {
                console.log('Client to be added : ' + cid);
                _this.AddToClientList(cid, socket.id);
            });
            socket.on('add_device', function (did) {
                console.log('Device to be added : ' + did);
                _this.AddToDeviceList(did, socket.id);
            });
            socket.on('remove_device', function () {
                var did = _this.GetDidFromSocketId(socket.id);
                if (did) {
                    delete ServerSocket.devices[did];
                    var devices = Object.values(ServerSocket.devices);
                    //this.SendMessage('user_disconnected', users, uid);
                    console.log(ServerSocket.devices);
                }
            });
        };
        this.GetUidFromSocketId = function (id) { return Object.keys(_this.users).find(function (uid) { return _this.users[uid] === id; }); };
        this.GetCidFromSocketId = function (id) {
            return Object.keys(ServerSocket.clients).find(function (cid) {
                ServerSocket.clients[cid] === id;
                // console.log(ServerSocket.clients[cid]);
            });
        };
        this.GetDidFromSocketId = function (id) {
            return Object.keys(ServerSocket.devices).find(function (did) {
                ServerSocket.devices[did] === id;
                // console.log(ServerSocket.devices[did]);
            });
        };
        this.AddToClientList = function (id, sid) {
            ServerSocket.clients[sid] = id;
            var clients = Object.values(ServerSocket.clients);
            // console.log(ServerSocket.clients);
        };
        this.AddToDeviceList = function (id, sid) {
            ServerSocket.devices[sid] = id;
            var devices = Object.values(ServerSocket.devices);
            // console.log(ServerSocket.devices);
        };
        ServerSocket.instance = this;
        this.users = {};
        ServerSocket.clients = {};
        ServerSocket.devices = {};
        ServerSocket.io = new socket_io_1.Server(server, {
            cors: {
                origin: 'http:localhost:3000',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'],
                exposedHeaders: ['Access-Control-Allow-Origin', '*'],
                credentials: true
            }
        });
        ServerSocket.io.engine.on("initial_headers", function (headers, req) {
            headers["Access-Control-Allow-Origin"] = "https://genxiot.com";
        });
        ServerSocket.io.engine.on("headers", function (headers, req) {
            headers["Access-Control-Allow-Origin"] = "https://genxiot.com"; // url to all
        });
        ServerSocket.io.on('connect', this.StartListeners);
        console.info('Socket IO started');
    }
    var _a;
    _a = ServerSocket;
    ServerSocket.clientSocket = [];
    ServerSocket.deviceSockets = [];
    ServerSocket.GetSocketIDsFromClientID = function (cid) {
        _a.clientSocket = [];
        for (var _i = 0, _b = Object.keys(_a.clients); _i < _b.length; _i++) {
            var key = _b[_i];
            if (_a.clients[key] === cid) {
                _a.clientSocket.push(key);
            }
        }
        return _a.clientSocket;
    };
    ServerSocket.GetSocketIDsFromDeviceID = function (did) {
        _a.deviceSockets = [];
        // Logger.info('socket', 'devices', this.devices);
        for (var _i = 0, _b = Object.keys(_a.devices); _i < _b.length; _i++) {
            var key = _b[_i];
            if (_a.devices[key] === did) {
                _a.deviceSockets.push(key);
            }
        }
        return _a.deviceSockets;
    };
    /**
     * Prepare message to send through socket
     * @param client_Id ID of client to whom the device belongs
     * @param device_Id ID of device whose data is to be sent
     * @param dataTimeStamp TimeStamp when data was received
     * @param payload device meta data like lastUpdated or complete deviceData
     */
    ServerSocket.PrepareMessage = function (client_Id, device_Id, dataTimestamp, payload) {
        // Logger.info('socket', 'client_Id', client_Id);
        var clientSockets = _a.GetSocketIDsFromClientID(client_Id);
        // Logger.info('socket', 'clientSockets', clientSockets);
        _a.SendMessage('client_data', clientSockets, dataTimestamp);
        var deviceSockets = _a.GetSocketIDsFromDeviceID(device_Id);
        // Logger.info('socket', 'deviceSockets', deviceSockets);
        // Logger.info('socket', 'payload', payload);
        _a.SendMessage('device_data', deviceSockets, payload);
    };
    /**
     * Send a message through the socket
     * @param name The name of the event, ex: handshake
     * @param users List of Socket id's
     * @param payload any information needed by the user for state updates
     */
    ServerSocket.SendMessage = function (name, users, payload) {
        // console.info('Emmitting Events: ' + name + ' to ', users);
        users.forEach(function (id) { return (payload ? _a.io.to(id).emit(name, payload) : _a.io.to(id).emit(name)); });
    };
    return ServerSocket;
}());
exports.ServerSocket = ServerSocket;

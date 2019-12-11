"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sturdy_websocket_1 = __importDefault(require("sturdy-websocket"));
var version_1 = require("../version");
var alchemySendHttp_1 = require("./alchemySendHttp");
var alchemySendWebSocket_1 = require("./alchemySendWebSocket");
var httpProvider_1 = require("./httpProvider");
var sendPayload_1 = require("./sendPayload");
var webSocketProvider_1 = require("./webSocketProvider");
function makeAlchemyContext(url, config) {
    if (/^https?:\/\//.test(url)) {
        var alchemySend = alchemySendHttp_1.makeHttpSender(url);
        var _a = sendPayload_1.makePayloadSender(alchemySend, config), sendPayload = _a.sendPayload, setWriteProvider = _a.setWriteProvider;
        var provider = httpProvider_1.makeAlchemyHttpProvider(sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else if (/^wss?:\/\//.test(url)) {
        var protocol = isAlchemyUrl(url) ? "alchemy-web3-" + version_1.VERSION : undefined;
        var ws = new sturdy_websocket_1.default(url, protocol);
        var alchemySend = alchemySendWebSocket_1.makeWebSocketSender(ws);
        var _b = sendPayload_1.makePayloadSender(alchemySend, config), sendPayload = _b.sendPayload, setWriteProvider = _b.setWriteProvider;
        var provider = new webSocketProvider_1.AlchemyWebSocketProvider(ws, sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else {
        throw new Error("Alchemy URL protocol must be one of http, https, ws, or wss. Recieved: " + url);
    }
}
exports.makeAlchemyContext = makeAlchemyContext;
function isAlchemyUrl(url) {
    return url.indexOf("alchemyapi.io") >= 0;
}

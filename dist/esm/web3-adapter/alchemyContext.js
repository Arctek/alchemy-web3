import SturdyWebSocket from "sturdy-websocket";
import { VERSION } from "../version";
import { makeHttpSender } from "./alchemySendHttp";
import { makeWebSocketSender } from "./alchemySendWebSocket";
import { makeAlchemyHttpProvider } from "./httpProvider";
import { makePayloadSender } from "./sendPayload";
import { AlchemyWebSocketProvider } from "./webSocketProvider";
export function makeAlchemyContext(url, config) {
    if (/^https?:\/\//.test(url)) {
        var alchemySend = makeHttpSender(url);
        var _a = makePayloadSender(alchemySend, config), sendPayload = _a.sendPayload, setWriteProvider = _a.setWriteProvider;
        var provider = makeAlchemyHttpProvider(sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else if (/^wss?:\/\//.test(url)) {
        var protocol = isAlchemyUrl(url) ? "alchemy-web3-" + VERSION : undefined;
        var ws = new SturdyWebSocket(url, protocol);
        var alchemySend = makeWebSocketSender(ws);
        var _b = makePayloadSender(alchemySend, config), sendPayload = _b.sendPayload, setWriteProvider = _b.setWriteProvider;
        var provider = new AlchemyWebSocketProvider(ws, sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else {
        throw new Error("Alchemy URL protocol must be one of http, https, ws, or wss. Recieved: " + url);
    }
}
function isAlchemyUrl(url) {
    return url.indexOf("alchemyapi.io") >= 0;
}
//# sourceMappingURL=alchemyContext.js.map
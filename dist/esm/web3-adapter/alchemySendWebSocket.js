var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { isResponse, } from "../types";
export function makeWebSocketSender(ws) {
    var resolveFunctionsById = new Map();
    ws.addEventListener("message", function (message) {
        var response = JSON.parse(message.data);
        if (!isResponse(response)) {
            return;
        }
        var id = getIdFromResponse(response);
        if (id === undefined) {
            return;
        }
        var resolve = resolveFunctionsById.get(id);
        if (resolve) {
            resolveFunctionsById.delete(id);
            if (!Array.isArray(response) &&
                response.error &&
                response.error.code === 429) {
                resolve({ type: "rateLimit" });
            }
            else {
                resolve({ response: response, type: "jsonrpc" });
            }
        }
    });
    ws.addEventListener("down", function () {
        var e_1, _a;
        var oldResolveFunctionsById = resolveFunctionsById;
        resolveFunctionsById = new Map();
        try {
            for (var _b = __values(oldResolveFunctionsById.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), id = _d[0], resolve = _d[1];
                resolve({
                    type: "networkError",
                    status: 0,
                    message: "WebSocket closed before receiving a response for request with id: " + id,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    return function (request) {
        return new Promise(function (resolve) {
            var id = getIdFromRequest(request);
            if (id !== undefined) {
                var existingResolve = resolveFunctionsById.get(id);
                if (existingResolve) {
                    var message = "Another WebSocket request was made with the same id (" + id + ") before a response was received.";
                    console.error(message);
                    existingResolve({
                        message: message,
                        type: "networkError",
                        status: 0,
                    });
                }
                resolveFunctionsById.set(id, resolve);
            }
            ws.send(JSON.stringify(request));
        });
    };
}
function getIdFromRequest(request) {
    if (!Array.isArray(request)) {
        return request.id;
    }
    return getCanonicalIdFromList(request.map(function (p) { return p.id; }));
}
function getIdFromResponse(response) {
    if (!Array.isArray(response)) {
        return response.id;
    }
    return getCanonicalIdFromList(response.map(function (p) { return p.id; }));
}
/**
 * Since the JSON-RPC spec allows responses to be returned in a different order
 * than sent, we need a mechanism for choosing a canonical id from a list that
 * doesn't depend on the order. This chooses the "minimum" id by an arbitrary
 * ordering: the smallest string if possible, otherwise the smallest number,
 * otherwise null.
 */
function getCanonicalIdFromList(ids) {
    var stringIds = ids.filter(function (id) { return typeof id === "string"; });
    if (stringIds.length > 0) {
        return stringIds.reduce(function (bestId, id) { return (bestId < id ? bestId : id); });
    }
    var numberIds = ids.filter(function (id) { return typeof id === "number"; });
    if (numberIds.length > 0) {
        return Math.min.apply(Math, __spread(numberIds));
    }
    return ids.indexOf(null) >= 0 ? null : undefined;
}
//# sourceMappingURL=alchemySendWebSocket.js.map
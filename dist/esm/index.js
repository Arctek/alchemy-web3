var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import Web3 from "web3";
import { callWhenDone } from "./util/promises";
import { makeAlchemyContext } from "./web3-adapter/alchemyContext";
var DEFAULT_MAX_RETRIES = 3;
var DEFAULT_RETRY_INTERVAL = 1000;
var DEFAULT_RETRY_JITTER = 250;
export function createAlchemyWeb3(alchemyUrl, config) {
    var fullConfig = fillInConfigDefaults(config);
    var _a = makeAlchemyContext(alchemyUrl, fullConfig), provider = _a.provider, setWriteProvider = _a.setWriteProvider;
    var alchemyWeb3 = new Web3(provider);
    alchemyWeb3.setProvider = function () {
        throw new Error("setProvider is not supported in Alchemy Web3. To change the provider used for writes, use setWriteProvider() instead.");
    };
    alchemyWeb3.setWriteProvider = setWriteProvider;
    var send = alchemyWeb3.currentProvider.send.bind(alchemyWeb3.currentProvider);
    alchemyWeb3.alchemy = {
        getTokenAllowance: function (params, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                method: "alchemy_getTokenAllowance",
                params: [params],
            });
        },
        getTokenBalances: function (address, contractAddresses, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                method: "alchemy_getTokenBalances",
                params: [address, contractAddresses],
                processResponse: processTokenBalanceResponse,
            });
        },
        getTokenMetadata: function (address, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                params: [address],
                method: "alchemy_getTokenMetadata",
            });
        },
    };
    return alchemyWeb3;
}
function fillInConfigDefaults(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.writeProvider, writeProvider = _c === void 0 ? getWindowProvider() : _c, _d = _b.maxRetries, maxRetries = _d === void 0 ? DEFAULT_MAX_RETRIES : _d, _e = _b.retryInterval, retryInterval = _e === void 0 ? DEFAULT_RETRY_INTERVAL : _e, _f = _b.retryJitter, retryJitter = _f === void 0 ? DEFAULT_RETRY_JITTER : _f;
    return { writeProvider: writeProvider, maxRetries: maxRetries, retryInterval: retryInterval, retryJitter: retryJitter };
}
function getWindowProvider() {
    return typeof window !== "undefined" ? window.ethereum : null;
}
function callAlchemyMethod(_a) {
    var _this = this;
    var method = _a.method, params = _a.params, send = _a.send, _b = _a.callback, callback = _b === void 0 ? noop : _b, _c = _a.processResponse, processResponse = _c === void 0 ? identity : _c;
    var promise = (function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, send(method, params)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, processResponse(result)];
            }
        });
    }); })();
    callWhenDone(promise, callback);
    return promise;
}
function processTokenBalanceResponse(rawResponse) {
    // Convert token balance fields from hex-string to decimal-string.
    var fixedTokenBalances = rawResponse.tokenBalances.map(function (balance) {
        return balance.tokenBalance != null
            ? __assign(__assign({}, balance), { tokenBalance: hexToDecimal(balance.tokenBalance) }) : balance;
    });
    return __assign(__assign({}, rawResponse), { tokenBalances: fixedTokenBalances });
}
/**
 * Converts a hex string to a string of a decimal number. Works even with
 * numbers so large that they cannot fit into a double without losing precision.
 */
function hexToDecimal(hex) {
    if (hex.startsWith("0x")) {
        return hexToDecimal(hex.slice(2));
    }
    // https://stackoverflow.com/a/21675915/2695248
    var digits = [0];
    for (var i = 0; i < hex.length; i += 1) {
        var carry = parseInt(hex.charAt(i), 16);
        for (var j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = (digits[j] / 10e16) | 0;
            digits[j] %= 10e16;
        }
        while (carry > 0) {
            digits.push(carry % 10e16);
            carry = (carry / 10e16) | 0;
        }
    }
    return digits.reverse().join("");
}
function noop() {
    // Nothing.
}
function identity(x) {
    return x;
}
//# sourceMappingURL=index.js.map
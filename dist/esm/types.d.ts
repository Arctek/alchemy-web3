export declare type JsonRpcId = string | number | null;
export interface JsonRpcRequest {
    jsonrpc: "2.0";
    method: string;
    params?: any[];
    id?: JsonRpcId;
}
export interface JsonRpcResponse<T = any> {
    jsonrpc: "2.0";
    result?: T;
    error?: JsonRpcError;
    id: JsonRpcId;
}
export declare type SingleOrBatchRequest = JsonRpcRequest | JsonRpcRequest[];
export declare type SingleOrBatchResponse = JsonRpcResponse | JsonRpcResponse[];
export interface JsonRpcError<T = any> {
    code: number;
    message: string;
    data?: T;
}
export interface SubscriptionEvent<T = any> {
    jsonrpc: "2.0";
    method: "eth_subscription";
    params: {
        subscription: string;
        result: T;
    };
}
export declare type WebSocketMessage = SingleOrBatchResponse | SubscriptionEvent;
export declare function isResponse(message: WebSocketMessage): message is SingleOrBatchResponse;
export declare function isSubscriptionEvent(message: WebSocketMessage): message is SubscriptionEvent;
export interface AlchemyWeb3Config {
    writeProvider?: Provider | null;
    maxRetries?: number;
    retryInterval?: number;
    retryJitter?: number;
}
export declare type FullConfig = Required<AlchemyWeb3Config>;
export declare type Provider = {
    sendAsync(payload: any, callback: any): void;
} | {
    send(payload: any, callback: any): void;
};
export interface Eip1193Provider {
    send(method: string, params?: any[]): Promise<any>;
}
export interface LegacyProvider {
    sendAsync(payload: any, callback: (error: any, result: any) => void): void;
}
export declare type Web3Callback<T> = (error: Error | null, result?: T) => void;
export declare type SendFunction = (method: string, params?: any[]) => Promise<any>;

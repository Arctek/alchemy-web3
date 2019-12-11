import Web3 from "web3";
import { AlchemyWeb3Config, Provider, Web3Callback } from "./types";
export interface AlchemyWeb3 extends Web3 {
    alchemy: AlchemyMethods;
    setWriteProvider(provider: Provider | null | undefined): void;
}
export interface AlchemyMethods {
    getTokenAllowance(params: TokenAllowanceParams, callback?: Web3Callback<TokenAllowanceResponse>): Promise<TokenAllowanceResponse>;
    getTokenBalances(address: string, contractAddresses: string[], callback?: Web3Callback<TokenBalancesResponse>): Promise<TokenBalancesResponse>;
    getTokenMetadata(address: string, callback?: Web3Callback<TokenMetadataResponse>): Promise<TokenMetadataResponse>;
}
export interface TokenAllowanceParams {
    contract: string;
    owner: string;
    spender: string;
}
export declare type TokenAllowanceResponse = string;
export interface TokenBalancesResponse {
    address: string;
    tokenBalances: TokenBalance[];
}
export declare type TokenBalance = TokenBalanceSuccess | TokenBalanceFailure;
export interface TokenBalanceSuccess {
    address: string;
    tokenBalance: string;
    error: null;
}
export interface TokenBalanceFailure {
    address: string;
    tokenBalance: null;
    error: string;
}
export interface TokenMetadataResponse {
    decimals: number | null;
    logo: string | null;
    name: string | null;
    symbol: string | null;
}
export declare function createAlchemyWeb3(alchemyUrl: string, config?: AlchemyWeb3Config): AlchemyWeb3;

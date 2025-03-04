import SturdyWebSocket from "sturdy-websocket";
import { FullConfig, Provider } from "../types";
import { VERSION } from "../version";
import { makeHttpSender } from "./alchemySendHttp";
import { makeWebSocketSender } from "./alchemySendWebSocket";
import { makeAlchemyHttpProvider } from "./httpProvider";
import { makePayloadSender } from "./sendPayload";
import { AlchemyWebSocketProvider } from "./webSocketProvider";

export interface AlchemyContext {
  provider: any;
  setWriteProvider(provider: Provider | null | undefined): void;
}

export function makeAlchemyContext(
  url: string,
  config: FullConfig,
): AlchemyContext {
  if (/^https?:\/\//.test(url)) {
    const alchemySend = makeHttpSender(url);
    const { sendPayload, setWriteProvider } = makePayloadSender(
      alchemySend,
      config,
    );
    const provider = makeAlchemyHttpProvider(sendPayload);
    return { provider, setWriteProvider };
  } else if (/^wss?:\/\//.test(url)) {
    const protocol = isAlchemyUrl(url) ? `alchemy-web3-${VERSION}` : undefined;
    const ws = new SturdyWebSocket(url, protocol);
    const alchemySend = makeWebSocketSender(ws);
    const { sendPayload, setWriteProvider } = makePayloadSender(
      alchemySend,
      config,
    );
    const provider = new AlchemyWebSocketProvider(ws, sendPayload);
    return { provider, setWriteProvider };
  } else {
    throw new Error(
      `Alchemy URL protocol must be one of http, https, ws, or wss. Recieved: ${url}`,
    );
  }
}

function isAlchemyUrl(url: string): boolean {
  return url.indexOf("alchemyapi.io") >= 0;
}

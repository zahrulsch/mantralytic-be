import { Server as SocketServer, ServerOptions } from "socket.io";
import type { Server } from "http";

type Status = "info" | "success" | "warning" | "error"

interface Logs {
  log: {
    type: "crawler" | "connection" | "";
    url: string;
    marketplaceType: "shopee" | "tokopedia" | string;
    status: Status;
    title: string;
  };
  dbLog: {
    title: string
    isLoading: boolean
    status: Status
  }
}

let socket: SocketServer = new SocketServer();

export const initSocket = (app: Server, opt?: Partial<ServerOptions>) => {
  socket = new SocketServer(app, opt);
  return socket;
};

export const getSocket = () => socket;

export function logEmiter<T extends keyof Logs>(type: T, options: Logs[T]) {
  const socks = getSocket();
  socks.emit(type, { ...options });
};

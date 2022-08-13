import { Server as SocketServer, ServerOptions } from "socket.io";
import type { Server } from "http";
import type { Log } from "../model/SocketResponse/Log.js";

let socket: SocketServer = new SocketServer();

export const initSocket = (app: Server, opt?: Partial<ServerOptions>) => {
  socket = new SocketServer(app, opt);
  return socket;
};

export const getSocket = () => socket;

export const logEmiter = (options: Log) => {
  const socks = getSocket();
  socks.emit("log", { ...options });
};

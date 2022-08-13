import { Server as SocketServer } from "socket.io";
let socket = new SocketServer();
export const initSocket = (app, opt) => {
    socket = new SocketServer(app, opt);
    return socket;
};
export const getSocket = () => socket;
export const logEmiter = (options) => {
    const socks = getSocket();
    socks.emit("log", { ...options });
};

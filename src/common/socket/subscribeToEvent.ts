import type {SocketEvents} from "@/common/constants/constants.ts";
import {getSocket} from "@/common/socket/getSocket.ts";
import type {Socket} from "socket.io-client";

export const subscribeToEvent = <T>(event: SocketEvents, callback: (data: T) => void) => {
    const socket: Socket = getSocket()

    socket.on(event, callback);

    return () => {
        socket.off(event, callback);
    }
}
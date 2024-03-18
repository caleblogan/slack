import { Request } from "express";
import { WebSocket, WebSocketServer } from "ws";
import { sessionParse } from "./session";
import MessageModel from "./models/MessageModel";

type WebsocketRequest = {
    action: string
    data?: any
}

const wss = new WebSocketServer({ clientTracking: false, noServer: true });

const clients = new Map<string, { socket: WebSocket, channelId?: string }>();
const channels = new Map<string, Set<string>>();

export function websockUpgradeHandler(request: Request, socket: any, head: any) {
    socket.on('error', onSocketError);

    console.log('Parsing session from request...');

    console.log('Session BEFORE: ', request.session);
    sessionParse(request, {} as any, () => {
        console.log('Session AFTER: ', request.session);
        if (!request.session.user?.id) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        console.log('Session is parsed!');

        socket.removeListener('error', onSocketError);

        wss.handleUpgrade(request, socket, head, (ws: any) => {
            wss.emit('connection', ws, request);
        });
    });
}

wss.on('connection', function (ws: WebSocket & WebSocketServer, request: Request) {
    const userId = request.session.user?.id;

    console.log("Connection", userId)

    ws.on('error', console.error);

    ws.on('message', async function (message: string) {
        if (!userId) return;
        console.log(`Received message ${message} from user ${userId}`);
        const { action, data } = JSON.parse(message) as WebsocketRequest;
        switch (action) {
            case "messages.new": {
                console.log("NEW MESSAGE", data)
                const { channelId } = clients.get(userId) ?? {}
                if (!channelId) return
                const message = await MessageModel.create(userId, data, channelId);
                broadcast(channelId, { action: "messages.new", data: { ...message, ...request.session.user } })
                break
            }
            case "channels.connect": {
                // TODO: verify that channel exists in DB
                leaveChannel()
                const { channelId } = data as { channelId: string }
                clients.set(userId, { socket: ws, channelId });
                if (!channels.has(channelId)) {
                    channels.set(channelId, new Set());
                }
                channels.get(channelId)!.add(userId);
                send(ws, { action: "channels.connect", data: { channelId } })
                break
            }
            case "channels.leave": {
                leaveChannel()
                break
            }
            default:
                throw new Error(`Invalid action: ${action}`)
        }
    });

    function leaveChannel() {
        if (!userId) return;
        const channelId = clients.get(userId)?.channelId
        if (channelId) {
            delete clients.get(userId)?.channelId
            channels.get(channelId)?.delete(userId)
        }
        send(ws, { action: "channels.leave", data: { channelId } })
    }

    function send(socket: WebSocket, message: WebsocketRequest) {
        socket.send(JSON.stringify(message))
    }

    function broadcast(channelId: string, message: WebsocketRequest) {
        const userIds = Array.from(channels.get(channelId) ?? []);
        for (let userId of userIds) {
            clients.get(userId)?.socket.send(JSON.stringify({ ...message, broadcast: true }))
        }
    }

    ws.on('close', function () {
        if (!userId) return;
        const user = clients.get(userId);
        if (user && user.channelId) {
            user.socket.close();
            channels.get(user.channelId)?.delete(userId)
            clients.delete(userId)
        }
    });
});

function onSocketError(error: any) {
    console.log('Socket error: ', error);
}
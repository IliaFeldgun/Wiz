import { Request, Response } from "express"
import IPlayer from "../lobby/interfaces/Player";

const SSE_RESPONSE_HEADER = {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
  };
export default class ServerSentEvents {
    static async subscribeClient(
        req: Request,
        res: Response,
        onUnsubscribe?: () => void
    ) {
        req.socket.setTimeout(0)
        req.socket.setNoDelay(true)
        req.socket.setKeepAlive(true)
        res.writeHead(200, SSE_RESPONSE_HEADER)

        res.write(`data: ${JSON.stringify("OK")}\n\n`)
        // TODO: Refactor it to session ID
        const clientId = req.playerId
        // TODO: Perhaps allow multiple responses per client
        const newClient = {
            id: clientId,
            res
        }
        ServerSentEvents.clients.push(newClient)

        req.on('close', () => {
            // TODO: Possibly log this
            onUnsubscribe()
            ServerSentEvents.unsubscribeClient(clientId)
        })
    }

    static unsubscribeClient(clientId: string) {
        ServerSentEvents.clients = ServerSentEvents.clients.filter(client => 
            client.id !== clientId
        )
    }
    static sendUpdateToClient(playerIds: IPlayer["id"][], payload?: any) {
        if (!payload) {
            payload = {
                update: true
            }
        }
        const clients = ServerSentEvents.clients
        clients.forEach(client => {
            if (playerIds.indexOf(client.id) !== -1) {
                client.res.write(`data: ${JSON.stringify(payload)}\n\n`)

                // TODO: notice any following problems and delete this whole nonsense
                // Without this response wasn't sent, Possibly a bug
                // Bug possibly fixed
                // Seems to not work on :3000, because of React-Scripts proxying
                // client.res.writeProcessing()
            }
        })
    }
    private static clients: {
        // TODO: Convert to sessionId
        id: string
        res: Response
    }[] = []
}
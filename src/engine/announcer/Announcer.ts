import {Request, Response} from 'express'
import SSE from "../request_handlers/server_sent_events"
import IPlayer from "../lobby/interfaces/Player"
import StoreSubscriber from "../data_stores/store_subscriber"

export default class Announcer {
    private static async storeSubscribe(
        gameId: string,
        playerId: IPlayer["id"],
        onMessage: () => void
    ) {
        StoreSubscriber.subscribe(gameId, playerId, onMessage)
    }
    private static async storeUnsubscribe(
        gameId: string,
        playerId: IPlayer["id"]
    ) {
        StoreSubscriber.unsubscribe(gameId, playerId)
    }
    private static async sseSubscribe(
        req: Request,
        res: Response,
        onUnsubscribe: () => void
    ) {
        SSE.subscribeClient(req, res, onUnsubscribe)
    }
    private static async sseUnsubscribe(playerId: string) {
        SSE.unsubscribeClient(playerId)
    }
    private static async sseSend(playerId: IPlayer["id"], payload: any) {
        SSE.sendUpdateToClient([playerId], payload)
    }
    static async subscribe(
        req: Request,
        res: Response,
        gameId: string,
        playerId: IPlayer["id"],
        payloadSource: () => Promise<any>
    ) {
        Announcer.storeSubscribe(gameId, playerId, async () => {
            Announcer.sseSend(playerId, await payloadSource())
        })
        Announcer.sseSubscribe(req, res, () => {
            Announcer.unsubscribe(gameId, playerId)
        })
    }
    static async unsubscribe(gameId: string, playerId: IPlayer["id"]) {
        Announcer.storeUnsubscribe(gameId, playerId)
        Announcer.sseUnsubscribe(playerId)
    }
}
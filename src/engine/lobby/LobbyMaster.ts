import IPlayer from "./interfaces/Player";
import IRoom from "./interfaces/Room";
import LobbyStore from "./LobbyStore";

export default class LobbyMaster {
    static async addPlayerToRoom(playerId: IPlayer["id"], roomId: IRoom["id"]): Promise<boolean> {
        const MAX_PLAYERS = 10
        const room: IRoom = await LobbyStore.getRoom(roomId)
        
        if (LobbyMaster.isGameInProgress(room)) {
            return false
        }

        const player: IPlayer = await LobbyStore.getPlayer(playerId)

        if (room && player && room.players.length < MAX_PLAYERS) {
            player.rooms = player.rooms.concat(roomId)
            room.players = room.players.concat(playerId)

            // TODO: Needs to be a single transaction
            const roomDone = await LobbyStore.setRoom(room.id, room)
            const playerDone = await LobbyStore.setPlayer(player.id, player)

            return roomDone && playerDone
        }
        else {
            return false
        }
    }
    static async removePlayerFromRoom(playerId: IPlayer["id"], roomId: IRoom["id"]): Promise<boolean> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        
        if (LobbyMaster.isGameInProgress(room)) {
            return false
        }

        const player: IPlayer = await LobbyStore.getPlayer(playerId)

        if (player && room) {
            player.rooms = player.rooms.filter((r) => r !== roomId)
            room.players = room.players.filter((p) => p !== playerId)

            // TODO: Needs to be a single transaction
            const roomDone = await LobbyStore.setRoom(room.id, room)
            const playerDone = await LobbyStore.setPlayer(player.id, player)

            return roomDone && playerDone
        }
        else {
            return false
        }
    }
    static async isPlayerInRoom(playerId: IPlayer["id"], roomId: IRoom["id"]) :
        Promise<boolean> {
        const [roomPlayerIds, playerRoomIds] = await Promise.all([
            LobbyMaster.getRoomPlayerIds(roomId),
            LobbyMaster.getPlayerRoomIds(playerId)
        ])
        const playerInRoom = roomPlayerIds.indexOf(playerId) !== -1
        const roomInPlayer = playerRoomIds.indexOf(roomId) !== -1
        return playerInRoom && roomInPlayer

    }
    static async getRoomPlayerIds(roomId: IRoom["id"]): Promise<IPlayer["id"][]> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room)
            return room.players
        else {
            return []
        }
    }
    static async getRoomPlayers(roomId: IRoom["id"]): Promise<IPlayer[]> {

        const playerIds = await LobbyMaster.getRoomPlayerIds(roomId)
        if (playerIds) {
            const playerReqs: Promise<IPlayer>[] = []
            playerIds.forEach((id) => {
                playerReqs.push(LobbyStore.getPlayer(id))
            })

            const players = await Promise.all(playerReqs)

            return players
        }
        else {
            return []
        }
    }
    static async getRoomLeader(roomId: IRoom["id"]): Promise<IRoom["leader"]> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room)
        {
            return room.leader
        }
        else {
            return ""
        }
    }
    static async setRoomLeader(playerId: IPlayer["id"], roomId: IRoom["id"]): Promise<boolean> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room) {
            room.leader = playerId
            const roomDone = await LobbyStore.setRoom(roomId, room)
            return roomDone
        }
        else {
            return false
        }
    }
    static async getPlayerRoomIds(playerId: IPlayer["id"]): Promise<IRoom["id"][]> {
        const player: IPlayer = await LobbyStore.getPlayer(playerId)
        if (player) {
            return player.rooms
        }
        else {
            return []
        }
    }
    static async getRoomGameType(roomId: IRoom["id"]): Promise<IRoom["gameName"]> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room){
            return room.gameName
        }
        else {
            return ""
        }
    }
    static async setRoomGameType(roomId: IRoom["id"],
                                 game: IRoom["gameName"]): Promise<boolean> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room) {
            room.gameName = game
            const roomDone = await LobbyStore.setRoom(roomId, room)
            return roomDone
        }
        else {
            return false
        }
    }
    static async setRoomGame(roomId: IRoom["id"],
                             game: IRoom["gameName"],
                             gameId: string): Promise<boolean> {
        const room: IRoom = await LobbyStore.getRoom(roomId)
        if (room) {
            room.gameName = game
            room.gameId = gameId
            const roomDone = await LobbyStore.setRoom(roomId, room)
            return roomDone
        }
        else {
            return false
        }
    }
    static isGameInProgress(room: IRoom): boolean {
        return room.gameId && room.gameName && true
    }
}
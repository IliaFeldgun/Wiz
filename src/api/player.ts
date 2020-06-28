import express from "express"
import LobbyBuilder from "../engine/lobby/LobbyBuilder"
import LobbyStore from "../engine/lobby/LobbyStore"
import LobbyMaster from "../engine/lobby/LobbyMaster"
import {HttpError} from "../engine/request_handlers/error_handler"

const router = express.Router()

router.post('/', async (req, res, next) => {
    if (req.playerId) {
        next(new HttpError(403, "Player already logged in"))
    }

    const playerName = req.body.playerName
    const playerId = await LobbyBuilder.createPlayer(playerName)

    if (playerId) {
        res.cookie("player_name", playerName, { signed: true, sameSite: true})
        res.cookie("player_id", playerId, { signed: true, sameSite: true })
        res.status(200).send({playerId})
    }
    else {
        next(new HttpError(500, "Player could not be created"))
    }
})

router.delete('/', async (req, res, next) => {
    const playerId = req.playerId

    if (!playerId) {
        next(new HttpError(401, "No player detected to delete"))
    }

    if (await LobbyStore.deletePlayer(playerId)) {
        res.clearCookie("player_name", { signed: true })
        res.clearCookie("player_id", { signed: true })
        res.status(200).send("Player deleted, cookie deleted")
    }
    else {
        next(new HttpError(500, "Player could not be deleted"))
    }
})

router.get('/rooms', async (req, res, next) => {
    const playerId = req.playerId

    if (!playerId) {
        next(new HttpError(401, "No player detected"))
    }
    const rooms = await LobbyMaster.getPlayerRoomIds(playerId)
    if (rooms) {
        res.status(200).send({rooms})
    }
    else {
        next(new HttpError(500, "Failed to get rooms"))
    }
})

export default router
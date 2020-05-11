import express from "express"
import { generateId } from "../engine/id_generator"
import store from "../engine/key_value_state_store"
const router = express.Router()

router.post('/', (req, res) => {
    const playerId = req.signedCookies["player_id"]
    
    if (playerId) {
        const roomId = generateId(playerId, process.env.UUID_ROOM_NAMESPACE)
        store.set()(roomId, JSON.stringify({leader: playerId, players: []}))
        res.send( "Room " + roomId + " created" );
    }
    else {
        res.status(403)
        res.send("Room can't be created, you need to set a player")
    }
});

router.get('/:roomId', (req, res) => {
    const roomId = req.params.roomId
    const playerId = req.signedCookies["player_id"]
    if (playerId) {
        store.get()(roomId, (err, reply) => {
            let room = JSON.parse(reply)
            if (room.players.filter((player: string) => player == playerId).length)
                res.send(room);
        })
    }
})
router.post('/player', ( req, res ) => {
    const playerId = req.signedCookies["player_id"]
    if (playerId) {
        const roomId = req.body.roomId
        
        if (roomId) {
            store.get()(roomId, (err, reply) => {
                let room = JSON.parse(reply)
                room.players.push(playerId)
                store.set()(roomId, JSON.stringify(room))
            })
        }
    }
    else {
        res.status(403)
        res.send("Room can't be joined, you need to set a player")
    }
} );

router.delete('/player', ( req, res ) => {
    // req.player
    // req.room
    res.send( "Player left room" );
} );
router.put('/leader', ( req, res ) => {
    // req.player
    // req.room
    // req.newleader
    res.send( "Leader changed" );
} );

router.put('/gametype', ( req, res ) => {
    // req.isPlayerMaster
    res.send( "game changed" );
} );

router.get('/gametype', ( req, res ) => {
    // req.isPlayerinRoom?
    res.send( "Game type is:" );
} );

export default router
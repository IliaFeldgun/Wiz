import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser"
import wizard from "./api/games/wizard"
import player from "./api/player"
import room from "./api/room"
import httpLogger from "morgan"
import {logger} from "./winston"
import assertPlayer from "./engine/request_handlers/player_assert"

const app = express();
const port = process.env.PORT; // default port to listen


app.use(httpLogger('dev'))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.urlencoded({extended: true}))
app.use(assertPlayer)

app.use(express.static('./client/build'))

app.use("/api/game/wizard", wizard)
app.use("/api/player", player)
app.use("/api/room", room)

// define a route handler for the default home page
/*app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );
*/
app.get( "/api", (req,res) => {
    res.send( "This is the API")
})

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile('index.html', {root: "./client/build"});
});

// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` );
} );
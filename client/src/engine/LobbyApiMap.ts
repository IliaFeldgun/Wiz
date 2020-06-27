import { AxiosRequestConfig } from 'axios'
import QueryString from 'querystring'
function GET_CONFIG(): AxiosRequestConfig {
    return {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }
}
function POST_CONFIG(): AxiosRequestConfig {
    return {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }
}
function POST_FORM_CONFIG(): AxiosRequestConfig {
    return {
        method: "POST",
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
}

const LOBBY_API_MAP = {
    ROOM: {
        GET_ROOM: {
            config: GET_CONFIG,
            url: (roomId: string) => {
                return `/api/room/${roomId}`
            }
        },
        CREATE_ROOM: {
            config: POST_CONFIG,
            url: () => {
                return `/api/room`
            }
        },
        JOIN_ROOM: {
            config: POST_CONFIG,
            url: (roomId: string) => {
                return `/api/room/${roomId}/join`
            }
        },
        GET_LEADER: {
            config: GET_CONFIG,
            url: (roomId: string) => {
                return `/api/room/${roomId}/leader`
            }
        },
        GET_PLAYER_NAMES: {
            config: GET_CONFIG,
            url: (roomId: string) => {
                return `/api/room/${roomId}/playernames`
            }
        },
        GET_GAME: {
            config: GET_CONFIG,
            url: (roomId: string) => {
                return `/api/room/${roomId}/game`
            }
        },
    },
    PLAYER: {
        GET_ROOMS: {
            config: GET_CONFIG,
            url: () => {
                return `/api/player/rooms`
            }
        },
        CREATE_PLAYER: {
            config: (playerName: string) => {
                const data = QueryString.stringify({playerName})
                return {...POST_FORM_CONFIG(), data}
            },
            url: () => {
                return `/api/player`
            },
        }
    }
}

export default LOBBY_API_MAP

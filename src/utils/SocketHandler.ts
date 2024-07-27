import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { SOCKET_URL } from './api'


function useSocket() {
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        const socketIo = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                token: null
            }

        })

        setSocket(socketIo)

        function cleanup() {
            socketIo.disconnect()
        }
        return cleanup

    }, [])

    return socket
}

export default useSocket


import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

let client = null
const listeners = new Set()

export function subscribeWS(fn) {
    if (typeof fn !== 'function') return () => {}
    listeners.add(fn)
    ensure()
    return () => listeners.delete(fn)
}

function ensure() {
    if (client && client.active) return

    client = new Client({
        webSocketFactory: () => new SockJS('/api/ws'),
        reconnectDelay: 1500,
        debug: () => {}
    })

    client.onConnect = () => {
        client.subscribe('/topic/changes', (frame) => {
            let msg
            try { msg = JSON.parse(frame.body) } catch { msg = frame.body }
            listeners.forEach(fn => fn(msg))
        })
    }

    client.activate()
}

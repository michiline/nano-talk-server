import WebSocket from 'ws'
import { logStartService } from '../utils'

const runChat = (server) => {
  const wss = new WebSocket.Server({ server: server, path: '/chat' })
  logStartService('Chat Server')
  wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
      console.log('received: %s', message)
    })
    ws.send('response')
  })
}

export { runChat }

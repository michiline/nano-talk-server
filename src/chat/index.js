import WebSocket from 'ws'
import { logStartService } from '../utils'

// const runChat = (server) => {
//   const wss = new WebSocket.Server({ server: server, path: '/chat' })
//   logStartService('Chat Server')
//   wss.on('connection', (ws, req) => {
//     ws.on('message', (message) => {
//
//     })
//     ws.send('response')
//   })
// }

const runChat = (server) => {
  const wss = new WebSocket.Server({ noServer: true, path: '/chat' })
  logStartService('Chat Server')
  wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
      console.log(message)
      ws.send(`received: ${message}`)
    })
    ws.send('opened connection')
  })

  server.on('upgrade', (req, socket, head) => {
    console.log(req.headers)
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req)
    })
  })
}

export { runChat }

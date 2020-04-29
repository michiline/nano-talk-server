import WebSocket from 'ws'
import { logStartService } from '../common'

const runChat = (server) => {
  let connectedSockets = {}

  const heartbeat = (ws) => {
    ws.isAlive = true
  }

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping()
    })
  }, 59000)

  const wss = new WebSocket.Server({ noServer: true, path: '/chat' })
  logStartService('Chat Server')

  wss.on('connection', (ws, req) => {
    ws.isAlive = true
    ws.on('pong', () => heartbeat(ws))

    const uid = req.headers.uid
    ws.send(`Socket ${uid} connected`)
    connectedSockets[uid] = ws
    console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)

    ws.on('message', (message) => {
      try {
        const { type, text, recipientUid } = JSON.parse(message)
        if (!type || !text || !recipientUid) {
          console.log('Message not properly formatted.')
          return
        }
        console.log(`Received ${type} from ${uid} for ${recipientUid}: ${text}`)
        if (type === 'text') {
          if (connectedSockets[recipientUid]) {
            connectedSockets[recipientUid].send({
              type,
              text,
              senderUid: uid
            })
          } else {
            console.log(`Recipient ${recipientUid} not connected.`)
          }
        }
      } catch (err) {
        console.log('Message not a json.')
      }
    })

    ws.on('close', (props, props2) => {
      console.log(`Socket ${uid} disconnected.`)
      delete connectedSockets[uid]
      console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)
    })
  })

  server.on('upgrade', (req, socket, head) => {
    // if (req.headers.uid not in database) {
    //   console.log('Reject socket upgrade.')
    //   socket.destroy()
    // }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req)
    })
  })

  wss.on('close', () => {
    clearInterval(interval)
  })
}

export { runChat }

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

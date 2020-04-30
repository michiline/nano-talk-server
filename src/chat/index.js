import WebSocket from 'ws'
import { logStartService } from '../common'
import { userRepository, conversationRepository } from '../routes'

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

  const wss = new WebSocket.Server({ noServer: true, path: '/socket' })
  logStartService('Chat Server')

  wss.on('connection', (ws, req) => {
    ws.isAlive = true
    ws.on('pong', () => heartbeat(ws))

    const id = req.headers.id
    ws.send(`Socket ${id} connected`)
    connectedSockets[id] = ws
    console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)

    // message object
    // const message = {
    //   data: [
    //     {
    //       recipientId: userId,
    //       [conversationId: conversationId] - for new conversation can be empty
    //       text: String
    //     }
    //   ]
    // }
    ws.on('message', async (messageString) => {
      try {
        const message = JSON.parse(messageString)

        // check message format
        if (!message.text || !message.recipientId) {
          console.log('Message not properly formatted.')
          return
        }
        console.log(`Received msg from ${id} for ${message.recipientId}: ${message.text}`)
        // store message
        // if conversation does not exist, create it
        if (!message.conversationId) {
          console.log('Conversation does not exist, creating new.')
          const conversation = await conversationRepository.create({
            userIds: [id, message.recipientId],
            text: message.text
          })
          console.log('Updating users with conversation.')
          await userRepository.createConversation({
            userIds: [id, message.recipientId],
            conversationId: conversation._id
          })
        } else {
          // conversation exists, add message
          console.log('Conversation exists, adding message.')
          await conversationRepository.addMessage({
            conversationId: message.conversationId,
            text: message.text,
            userId: id
          })
        }
        // check if recipient online
        if (connectedSockets[message.recipientId]) {
          // push to socket
          connectedSockets[message.recipientId].send(JSON.stringify({
            text: message.text,
            senderId: id
          }))
        } else {
          // mark message
          console.log(`Recipient ${message.recipientId} not connected.`)
        }
      } catch (err) {
        console.log(err)
        console.log('Message not a json.')
      }
    })

    ws.on('close', (props, props2) => {
      console.log(`Socket ${id} disconnected.`)
      delete connectedSockets[id]
      console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)
    })
  })

  server.on('upgrade', (req, socket, head) => {
    // if (req.headers.id not in database) {
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

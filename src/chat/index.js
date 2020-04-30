import WebSocket from 'ws'
import { logStartService, millisToString } from '../common'
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

  wss.on('connection', async (ws, req) => {
    try {
      // start heartbeat
      ws.isAlive = true
      ws.on('pong', () => heartbeat(ws))
      // authenticate
      const userId = req.headers.uid
      // store socket
      connectedSockets[userId] = ws
      // fetch last connected info
      const user = await userRepository.findById(userId)
      const userConversations = await conversationRepository.getUnreadMessages({
        conversationIds: user.conversationIds,
        lastConnected: user.lastConnected
      })
      const unreadConversations = userConversations.filter(conversation => conversation.messages.length > 0)
      console.log(`User ${userId} last connected at ${millisToString(new Date(user.lastConnected))}`)
      console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)
      ws.send(JSON.stringify(unreadConversations))
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
      ws.on('message', async (conversationsString) => {
        try {
          let conversations = JSON.parse(conversationsString).map(
            conversation => {
              conversation.messages = conversation.messages.map(
                message => {
                  message.userId = userId
                  return message
                }
              )
              return conversation
            }
          )
          for (const { conversationId, recipientId, messages } of conversations) {
            // check if recipient online
            if (connectedSockets[recipientId]) {
              // push to socket
              connectedSockets[recipientId].send(JSON.stringify({ conversationId, messages }))
              console.log(`${userId} sent ${messages.length} messages to ${recipientId}.`)
            } else {
              console.log(`${userId} stored ${messages.length} messages for ${recipientId}.`)
            }
            await conversationRepository.addMessages({
              conversationId,
              messages
            })
          }
        } catch (err) {
          console.log(err)
          console.log('Message not a json.')
        }
      })

      ws.on('close', async () => {
        console.log(`Socket ${userId} disconnected.`)
        delete connectedSockets[userId]
        await userRepository.updateOne({
          userId,
          lastConnected: Date.now()
        })
        console.log(`Connected sockets: [${Object.keys(connectedSockets)}]`)
      })
    } catch (err) {
      console.log(err)
    }
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

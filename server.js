const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')

// TODO: should just force https
const app = express()
const privateKey  = fs.readFileSync('ssl/server.key', 'utf8')
const certificate = fs.readFileSync('ssl/server.crt', 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate
}

app.use(express.static('client'))
app.use(require('body-parser').json())

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/eventstream', (req, res, next) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  app.on('message', data => {
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  })
})

app.post('/message', (req, res, next) => {
  const { queue, queueId } = req.body
  processQueue(queue, queueId)
})

const processQueue = (size, queueId) => {
  const total = size

  const process = setInterval(() => {
    notify(`processing ${size--} of ${total}`, queueId)
    if (size < 1) clearInterval(process)
  }, 1000)
}

const notify = (message, queueId) => app.emit('message', { message, queueId })

// TODO: is this even necessary?
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(5678, () => console.log('how do I write node.js? Check port 5678?'))

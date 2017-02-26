const WebSocketServer = require('websocket').server
const http = require('http')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// TODO: make configurable
const socketPort = 9000
const rendererPort = 9001

const server = http.createServer()
server.listen(socketPort)

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

var appConnection

const rendererServer = http.createServer((request, response) => {

    if(request.method === 'GET') {
        const templatePath = path.resolve(__dirname, './web/index.html')
        const template = fs.readFileSync(templatePath)
        
        const page = _.template(template)({
            socketPort,
            rendererPort,
        })

        response.end(page)
        return
    }

    var body = []

    request.on('error', err => {
            response.end('Error processing the request')
        })
        .on('data', chunk => {
            body.push(chunk)
        })
        .on('end', () => {

            body = Buffer.concat(body).toString()
            
            appConnection.sendUTF(JSON.stringify(body))
            response.end()
        })
})

rendererServer.listen(rendererPort)

console.log(`Socket running on ${socketPort}`)
console.log(`Renderer: http://localhost:${rendererPort}`)

wsServer.on('request', request => {

    appConnection = request.accept('json', request.origin);

    console.log('App connected')

    appConnection.on('message', message => {
        
        console.log('App received message: ' + message.utf8Data);
    })

    appConnection.on('close', (reasonCode, description) => {
        console.log('app disconnected');
    })

})

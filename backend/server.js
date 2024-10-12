// Importation du package Http
const http = require('http')
//Importation de l'application
const app = require('./app')

const normalizePort = val => {
    const port = parseInt(val, 10)
    
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
// Indication du port sur lequel tourne l'application express
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Recherche des différentes erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
            case 'EADDRINUSE':
                console.error(bind + ' is already in use.')
                process.exit(1)
                break
                default:
                    throw error
                }
            }
            
// Passage de l'application au serveur
const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})
//  Configuration du serveur pour qu'il écoute sur le port 3000
server.listen(port)
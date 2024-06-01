// Importation du package Http
const http = require('http')

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse P6 !')
})

server.listen(process.env.PORT || 3000)
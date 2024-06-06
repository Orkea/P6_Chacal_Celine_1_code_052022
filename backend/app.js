// Installation du framework Express
const express = require('express')
const app = express()
// Importation du routeur
const userRoutes = require('./routes/user')

// Installation de mongoose et connexion
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://orkea971:rDIi3kJn3e0cNFmX@orkea-p6.me8lzrt.mongodb.net/?retryWrites=true&w=majority&appName=Orkea-P6')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

// Express prend toutes les requêtes qui ont comme Content-Type : application/json  et met à disposition leur  body  directement sur l'objet req
app.use(express.json())

// Middleware autorisant l'acces CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})  

//Enregistrement du router
app.use('/api/auth', userRoutes)

//Configurons une réponse simple
app.get('/api/sauce',(req, res, next) => {

const sauce = [
    {
        userId: "MondMongoDB Id",
        name: "Sauce piment",
        manufacturer : "Gwada sauce",
        description : "Sauce piquant*5",
        mainPepper : "BondaManJak",
    }
]    
res.status(200).json(sauce)
console.log(sauce)
})


module.exports = app
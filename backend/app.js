// Importation de mongoose
const mongoose = require('mongoose')
// Importation du framework Express
const express = require('express')
// Importation du routeur sauce
const sauceRoutes = require('./routes/sauce')
// Importation du routeur user
const userRoutes = require('./routes/user')
// Importation pour accéder au path du serveur
const path = require('path')
// Importation de dotenv pour les variavles d'environnement
require('dotenv').config()
// Appel de la méthode express
const app = express()

// Installation de mongoose et connexion
mongoose.connect(process.env.URL_MONGOOSE)
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

// Enregistrement du router utilisateur
app.use('/api/auth', userRoutes)
// Enregistrement du router sauce
app.use('/api/sauces', sauceRoutes)
// Gestion de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')))

//Export de app pour y avoir accès depuis les autres fichiers
module.exports = app
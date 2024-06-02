// Installation du framework Express
const express = require('express')
const app = express()
// Installation de mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://orkea971:rDIi3kJn3e0cNFmX@orkea-p6.me8lzrt.mongodb.net/?retryWrites=true&w=majority&appName=Orkea-P6',
    //  {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     }
)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

//Configurons une réponse simple
app.use((req, res, next) => {
    console.log('Requête reçue !')
    next()
})

app.use((req, res, next) => {
    res.status(201)
    next()
})

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' })
    next()
})

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !')
})

module.exports = app
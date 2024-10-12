// Importation du framework Express
const express = require('express')
// Création d'un router
const router = express.Router()
// Importation du controleur pour le gestion des utilisateurs (création - connexion)
const userCtrl = require('../controllers/user')

// Routeur pour la Création d'un utilisateur
router.post('/signup', userCtrl.signup)
// Routeur pour la Connexion d'un utilisteur
router.post('/login', userCtrl.login)

// Exportation du routeur pour y avoir accès à partir des autres fichiers
module.exports = router
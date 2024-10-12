// Importation du framework Express
const express = require('express')
// Création d'un router
const router = express.Router()
// Importation du middleware d'authentification
const auth = require('../middleware/auth')
// Importation du middleware multer pour les images
const multer =  require('../middleware/multer-config')
// Importation du controleur pour les sauces
const sauceCtrl = require('../controllers/sauce')

// Implementation des routers 
// Routeur pour Affichage de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce)
// Routeur pour Création d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce)
// Routeur pour Affichage d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce)
// Routeur pour Modifiaction d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
// Routeur pour Suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce)
// Routeur pour like et dislike de la sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce)

// Exportation du routeur pour y avoir accès à partir des autres fichiers
module.exports = router
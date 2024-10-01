const express = require('express')
const router = express.Router()
// Importation du middleware d'authentification
const auth = require('../middleware/auth')
// Importation du middleware multer pour les images
const multer =  require('../middleware/multer-config')
// Importation du controleur pour les sauces
const sauceCtrl = require('../controllers/sauce')

//Implementation des routers 
router.get('/', auth, sauceCtrl.getAllSauce)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router
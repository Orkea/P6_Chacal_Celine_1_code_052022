const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

// Configuration pour l'enregistrement des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const name2 = name.split('.')[0]
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name2 + '_' + Date.now() + '.' + extension)
  }
})

// Exportation de multer + gestion des fichiers images téléchargés
module.exports = multer({storage: storage}).single('image')
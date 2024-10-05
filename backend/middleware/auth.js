const jwt = require('jsonwebtoken')
// Importation de dotenv pour les variavles d'environnement
require('dotenv').config()
 
module.exports = (req, res, next) => {
   try {
        // Extraction du token du header Authorization de la requête
       const token = req.headers.authorization.split(' ')[1]
       // Decodage du token
       const decodedToken = jwt.verify(token, `${process.env.RANDOM_TOKEN_SECRET}`)
       // Extraction de l'ID utilisateur
       const userId = decodedToken.userId
       req.auth = {
           userId: userId
       }
    // Passage à l'excution suivante si tout est OK
	next()
   } catch(error) {
       res.status(401).json({ error })
   }
}
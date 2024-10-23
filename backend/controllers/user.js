//Importation de bcrypt
const bcrypt = require('bcrypt')
//Importation du model user
const User = require('../models/user')
// Importation du token d'authentification
const jwt = require('jsonwebtoken')
const validEmailData = require('../validation/validation')
// Importation de dotenv pour les variables d'environnement
require('dotenv').config()

// Export de la fonction de création de compte utilisateur
exports.signup = (req, res, next) => {
    // Validation des données saisie par l'utilisateur par Joi
    const { error, value} = validEmailData(req.body)
    if(error){
        return res.status(400).json({message : "Mauvaise requete"})
    } else{
        // Création du hash du mot de passe avec l'algorithme de bcrypt *10 .
        bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            // Création d'une instance du model User
            const user = new User({
                email: req.body.email,
                password: hash
            })
            // Sauvegarde du user créé dans le DB
            user.save()
            .then(() =>{
              return  res.status(201).json({message: "Utilisateur créé ! "})
            } )
                
            .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
    }


}

// Export de la fonction de connexion des utilisateurs
exports.login = (req, res, next) => {
    // Utilisation de la methode FindOne pour trouver l'utilisateur dans le DB
        User.findOne({ email: req.body.email })
            .then(user => {
                // Vérification de l'existance de l'utilisateur dans la DB
                if (!user) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'})
                }
                // Comparaison du hash de la DB et celui générer pr le mot de passe de l'utilisateur 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        // Si le mot de passe n'est pas valide on retourne un message
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                        }
                        res.status(200).json({
                            // si le mot de passe est valide on retourne les données de l'utilisateur
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                `${process.env.RANDOM_TOKEN_SECRET}`,
                                { expiresIn: '24h' }
                            )
                        })
                    })
                    .catch(error => res.status(500).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
}
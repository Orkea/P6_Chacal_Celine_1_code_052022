//Importation de bcrypt
const bcrypt = require('bcrypt')
//Importation du model user
const User = require('../models/user')
// Importation du token d'authentification
const jwt = require('jsonwebtoken')
// Importation de dotenv pour les variavles d'environnement
require('dotenv').config()

exports.signup = (req, res, next) => {
    //Création du mot de pass avec algorithme de bcrypt *10 .
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() =>{
          return  res.status(201).json({message: "Utilisateur créé ! "})
        } )
            
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))

}

exports.login = (req, res, next) => {
    // utilisation de la methode FindOne poour trouver l'utilisateur
        User.findOne({ email: req.body.email })
            .then(user => {
                //Verification de l'existance de l'utilisateur dans la Base de Données
                if (!user) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'})
                }
                // Si l'utilisteur existe on compare le mode de passe
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        // si le mot de pass n'est pas valide on retourne un message
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
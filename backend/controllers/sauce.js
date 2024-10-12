// Importation du Model sauce
const Sauce = require('../models/sauce')
const fs = require("fs")

// Exportation de la fonction pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
   // Supression des données non souhaitées
    delete sauceObject._id
    delete sauceObject.likes
    delete sauceObject.dislikes
    // Vérification de la valeur de heat
    const heat = sauceObject.heat
    if (heat <= 0 || heat > 10){
        fs.unlink(`images/${req.file.filename}`,()=>{
            res.status(400).json({ message: "Mauvaise requete"})
        })
    }else{
      // Création d'une instance du model Sauce
      const sauce = new Sauce({
          ...sauceObject,
          userId: req.auth.userId,
          // Reconstrution de l'URL complète du fichier enregistré
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          usersLiked : [],
          usersDisliked: []
      })
        // Sauvegarde de la sauce crée dans la DB
        sauce.save()
            .then(() => res.status(201).json({ message: "Objet enregistré !" }))
            .catch(error => {res.status(400).json({ error });
            })
    }
}

// Exportation de la fonction pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

// Exportation de la fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject._userId
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non AUTORISER" })
            } 
            if(req.file && sauce.userId === req.auth.userId ){
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Objet modifié!. Image précédente effacée de la base'}))
                    .catch(error => res.status(401).json({ error }))
                })
                } else if (sauce.userId === req.auth.userId) {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Objet modifié !" }))
                    .catch(error => { res.status(400).json({ error }) })
            }
        })
        .catch(error => res.status(401).json({ error }))

}

// Exportation de la fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non AUTORISER" })
            } else {
                const filename = sauce.imageUrl.split("/images")[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).js({ error }))
}

// Exportation de la fonction pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// Exportation de la fonction pour liker ou disliker une sauce
exports.likeSauce = (req, res, next) =>{
    const userId = req.auth.userId
    const like = req.body.like

    // Securisation du nombre de like reçu(s) du frontend
    if(![-1, 0, 1].includes(like)){
        return res.status(401).json({Message:"Non AUTORISE"})
    } else {
        // Recupération de la Sauce dans la DBB
        Sauce.findOne({ _id: req.params.id })

        .then(sauce =>{
            // L'utilisateur like la sauce
            if(!sauce.usersLiked.includes(userId) && like === 1){
                Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: +1}, $push:{usersLiked: userId} })
                    .then(() => res.status(201).json({Message:"L'Utilisateur à LIKER"}))
                    .catch(error => { res.status(400).json({ error }) })
                }
            // L'utilisateur dislike la sauce
            if(!sauce.usersDisliked.includes(userId) && like === -1){
                Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: +1}, $push:{usersDisliked: userId} })
                    .then(() => res.status(201).json({Message:"L'Utilisateur à DISLIKER"}))
                    .catch(error => { res.status(400).json({ error }) })
                }
            // L'utilisateur enleve son like
            if(sauce.usersLiked.includes(userId) && like === 0){
                Sauce.updateOne({ _id: req.params.id }, {  $inc:{likes: -1} ,$pull:{usersLiked: userId}})
                .then(() => res.status(201).json({Message:"L'Utilisateur à enlever son like"}))
                .catch(error => { res.status(400).json({ error }) })
            } 
             // L'utilisateur enleve son dislike
             if(sauce.usersDisliked.includes(userId) && like === 0){
                Sauce.updateOne({ _id: req.params.id }, {  $inc:{dislikes: -1} ,$pull:{usersDisliked: userId}})
                .then(() => res.status(201).json({Message:"L'Utilisateur à enlever son dislike"}))
                .catch(error => { res.status(400).json({ error }) })
            } 
            })
        .catch(error => res.status(404).json({ error }))
    }    
}
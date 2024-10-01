const Sauce = require('../models/sauce')
const fs = require("fs")

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
   // Supression des données non souhaitées
    delete sauceObject._id
    delete sauceObject._userId
    delete sauceObject.likes
    delete sauceObject.dislikes

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch(error => {res.status(400).json({ error });
        })
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

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

            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
                    .catch(error => { res.status(400).json({ error }) })
            }
        })
        .catch(error => res.status(401).json({ error }))

}

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

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.likeSauce = (req, res, next) =>{
    const userId = req.auth.userId
    const like = req.body.like

    // Securisation du nombre de like reçu(s)
    if(![-1, 0, 1].includes(like)){
        return res.status(403).json({Message:"Non autorisé"})
    } else {
        // Recupération de la Sauce dans la DBB
        Sauce.findOne({ _id: req.params.id })

        .then(sauce =>{
            // L'utilisateur like la sauce
            if(!sauce.usersLiked.includes(userId) && like === 1){
                Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: like}, $push:{usersLiked: userId}, $pull:{usersDisliked: userId} })
                    .then(() => res.status(201).json({Message:"L'Utilisateur à LIKER"}))
                    .catch(error => { res.status(400).json({ error }) })
                }
            // L'utilisateur dislike la sauce
            if(!sauce.usersDisliked.includes(userId) && like === -1){
                Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: like}, $push:{usersDisliked: userId}, $pull:{usersLiked: userId} })
                    .then(() => res.status(201).json({Message:"L'Utilisateur à DISLIKER"}))
                    .catch(error => { res.status(400).json({ error }) })
                }
            // Lutilisateur est neutre sur la sauce
            if(like === 0){
                Sauce.updateOne({ _id: req.params.id }, {$pull:{usersLiked: userId}, $pull:{usersDisliked: userId} })
                .then(() => res.status(201).json({Message:"L'Utilisateur est neutre"}))
                .catch(error => { res.status(400).json({ error }) })
            }  
            })
        .catch(error => res.status(404).json({ error }))
    }    
}
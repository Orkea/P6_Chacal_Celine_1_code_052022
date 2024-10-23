// Importation du Model sauce
const Sauce = require('../models/sauce')
const fs = require("fs")
// Importation de la fonction pour la validation des données envoyés oour la sauce
const validSauceData = require('../validation/validation')

// Exportation de la fonction pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    console.log("======= Avant parse =====")
    console.log(req.body.sauce)

    const sauceObject = JSON.parse(req.body.sauce)

    console.log("======= Apres parse =====")
    console.log(sauceObject)
    
   // Supression des données non souhaitées
    delete sauceObject._id
    delete sauceObject.likes
    delete sauceObject.dislikes
    delete sauceObject.usersLiked
    delete sauceObject.usersDisliked
    delete sauceObject.userId
 
    // Validation des données par JOI
    const { error, value} = validSauceData(sauceObject)
    if (error){
        fs.unlink(`images/${req.file.filename}`,()=>{
         res.status(400).json({ message: "Mauvaise requete"})
        })
    }else{

      // Création d'une instance du model Sauce
      const sauce = new Sauce({
          ...sauceObject,
          userId: req.auth.userId,
          // Reconstrution de l'URL complète du fichier enregistré
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
    } : { ...req.body}

    // Supression des données non souhaitées
    delete sauceObject._userId
    delete sauceObject.likes
    delete sauceObject.dislikes
    delete sauceObject.usersLiked
    delete sauceObject.usersDisliked
    delete sauceObject.userId

    // Validation des données par JOI
    const { error, value} = validSauceData(sauceObject)
    
    if (error){
       return  res.status(400).json({ message: "Mauvaise requete"})
    }
   // Récuperation d'une sauce dans la DataBase
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Si l'utilisateur n'est pas celui de la sauce
            if (sauce.userId != req.auth.userId) {
                // Supression du ficher du repertoire image
                fs.unlink(`images/${req.file.filename}`,()=>{
             return res.status(401).json({ message: "Non AUTORISER" })
             })
            }
            //Si l'utilisateur est celui de la sauce
            if(sauce.userId === req.auth.userId ){
                //Requete avec autre image
                if (req.file){
                    const filename = sauce.imageUrl.split('/images/')[1]
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({message : 'Objet modifié!. Image précédente effacée de la base'}))
                        .catch(error => res.status(401).json({ error }))
                        })
                } else {
                    // Requete sans image
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(201).json({ message: "Objet modifié !"}))
                        .catch(error => { res.status(400).json({ error }) })
                    }
            }
        })
        .catch(error => 
            res.status(401).json({ error }))
}

// Exportation de la fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
              return res.status(401).json({ message: "Non AUTORISER" })
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
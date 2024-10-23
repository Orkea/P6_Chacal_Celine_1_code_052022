// Importation de Joi
const Joi = require ('Joi')

// Fonction qui permet de valider les données envoyée au backend pour la sauce
function validSauceData (body){
    const validSauce = Joi.object({
        name : Joi.string().required(),
        manufacturer: Joi.string().required(),
        description: Joi.string().required(),
        mainPepper: Joi.string().required(),
        heat: Joi.number().integer().min(1).max(10).required(),
        imageUrl: Joi.string().uri({ scheme: ['http', 'https'] })
    })
 return validSauce.validate(body)
}

// Fonction qui permet de valider les données envoyée au backend pour la création d'un utilisateur

function validEmailData(email){
    const validEmail = Joi.object({
        email: Joi.string().pattern(new RegExp("^[a-zA-Z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+$")).required(),
        password : Joi.string().min(2).trim().required()
    })
    return validEmail.validate(email)

}
// Export de la fonction validSauceData pour qu'elle soit accessible à partir des autres fichiers
module.exports = validSauceData
module.exports = validEmailData
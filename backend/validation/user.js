// Importation de Joi
const Joi = require('joi')

// Fonction qui permet de valider les données envoyées au backend pour la création d'un utilisateur

function validUserData(user) {
    const validEmail = Joi.object({
        email: Joi.string().pattern(new RegExp("^[a-zA-Z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+$")).required(),
        password: Joi.string().min(2).trim().required()
    })
    return validEmail.validate(user)

}
// Export de la fonction validSauceData pour qu'elle soit accessible à partir des autres fichiers
module.exports = validUserData
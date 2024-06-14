const companyModel= require('../models/companyModel')

const authguard = async (req, res, next) => {
    try {
        if (req.session.admin) {
            let admin = await companyModel.findOne({ _id: req.session.admin })

            if (admin) {
                return next();
            }
        }
        throw new Error("utilisateur non  connecté")
    } catch (error) {
       
        res.redirect('/login')
    }
};

module.exports = authguard;
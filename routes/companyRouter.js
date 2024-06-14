const companyModel = require("../models/companyModel");
const companyRouter = require('express').Router();
const authGuard = require("../services/authGuard");
const bcrypt = require('bcrypt');

companyRouter.get('/', (req, res) => {
    try {
        let errors = null
        let adminId = req.session.adminId;
        if(req.session.errors) {
            errors = req.session.errors;
            delete req.session.errors;
        }
        res.render('pages/home.twig', {
            errors: errors,
            adminId: adminId
        })
    } catch (error) {
        error = { server_error: "Erreur lors de la connexion au serveur."};
        req.session.errors = error;
        return res.redirect('/login');
    }
})


companyRouter.get('/register',(req,res)=>{
    res.render('pages/register.twig')
});
companyRouter.get('/login',(req,res)=>{

    res.render('pages/login.twig')
});
companyRouter.get('/adminDashboard',authGuard,async (req,res)=>{
    const company = await companyModel.findById(req.session.admin).populate('employees')
    res.render('pages/adminDashboard.twig',{
        company: company,
        adminId: req.session.admin
    })
});
companyRouter.get('/search', authGuard, async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const company = await companyModel.findById(req.session.admin).populate({
            path: 'employees',
            match: { name: searchTerm } // Recherche par nom d'employé
        });
        res.render('pages/adminDashboard.twig', {
            company: company,
            adminId: req.session.admin
        });
    } catch (error) {
        console.error(error);
        // Gérer les erreurs de recherche
        res.render('pages/adminDashboard.twig', {
            adminId: req.session.admin,
            errorMessage: "Une erreur s'est produite lors de la recherche."
        });
    }
});


companyRouter.post('/login', async (req, res)  => {
    try {
        let admin = await companyModel.findOne({ email: req.body.email })
        if (admin) {

            if (await bcrypt.compare(req.body.password, admin.password)) {
                req.session.admin = admin._id
                res.redirect('/adminDashboard')
            } else {
                throw { password: "Mauvais mot de passe" }
            }
        } else {
            throw { email: "Cet utilisateur n'est pas enregistré" }
        }
    } catch (error) {
        res.render('pages/login.twig',{ error })
    }
}
)

companyRouter.get('/logout',async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        res.send(error)    }
})


companyRouter.post('/addCompany', async (req, res) => {
    try {
      
        let newCompany = new companyModel(req.body);
        let validationError = newCompany.validateSync();
        if (validationError) {
            req.session.errors = validationError.errors;
            return res.redirect('/register');
        } else {
            await newCompany.save();
            res.redirect('/login')
                  }
    } catch (error) {
        console.error(error);
        req.session.errors = [{ message: "Erreur lors de l'inscription de l'entreprise." }];
        return res.redirect('/register');
    }
});



module.exports = companyRouter;
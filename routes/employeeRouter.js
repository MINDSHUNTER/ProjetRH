const companyModel=require("../models/companyModel");
const employeeModel = require ("../models/employeeModel");
const authGuard = require("../services/authGuard");
const employeeRouter = require('express').Router();
const upload =require('../services/multer');



employeeRouter.post('/addEmployee', authGuard,upload.single("photo"), async(req,res)=>{
    try {
        let newEmployee = new employeeModel(req.body);
        if (req.file) {
            newEmployee.photo = req.file.filename;
        }  
        let validationError = newEmployee.validateSync();
        if (validationError) {
            throw validationError;
        }
        newEmployee.save();
        console.log(req.session.admin);
        await companyModel.updateOne({_id: req.session.admin}, {$push :{employees: newEmployee.id }});   
        res.redirect("/adminDashboard");
    } catch (error) {
      console.log(error);
        req.session.errors = error.errors;
        res.redirect("/adminDashboard");
    }
});

employeeRouter.get('/deleteEmployee/:id', authGuard, async (req, res) => {
    try {
        await employeeModel.deleteOne({ _id: req.params.id });
        await companyModel.updateOne({_id: req.session.admin}, {$pull: {employees: req.params.id}})
        req.session.messages = "Cet employé à bien été supprimé";
    } catch (error) {
        req.session.errors = error.errors;
    }
    res.redirect("/adminDashboard");
});




employeeRouter.get('/updateEmployee/:id', authGuard, async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ _id: req.params.id });
        res.render("pages/adminDashboard.twig", {
            employee: employee
        })
    } catch (error) {
        req.session.errors = error.errors;
        res.redirect("/adminDashboard");
    }
})
employeeRouter.post('/updateEmployee/:id', authGuard, upload.single("photo"), async (req, res) => {
    try {
        if (req.file) {
            // Mettez à jour le nom de la photo dans les données de l'employé
            req.body.photo = req.file.filename;
        }
        await employeeModel.updateOne({ _id: req.params.id }, req.body);
        req.session.messages = "L'employé a bien été modifié";
    } catch (error) {
        req.session.errors = error.errors;
    }
    res.redirect("/adminDashboard");
})



employeeRouter.get('/blameEmployee/:id', authGuard, async (req,res) =>{
    try{
        employee = await employeeModel.findOne({_id:req.params.id});
        nbrblame = employee.number_of_blames + 1;
        if(nbrblame>=3){
            await employeeModel.deleteOne({_id:req.params.id});
            await companyModel.updateOne({_id: req.session.adminId}, {$pull: {employees: req.params.id}})
            req.session.messages = "L'employé à été supprimé car il n'a plus de solde";
        }else{
            await employeeModel.updateOne({ _id: req.params.id}, {number_of_blames: nbrblame});
            req.session.messages = "Le blâme a bien été prise en compte";
        }
        res.redirect('/adminDashboard');
    }catch(error){
        res.render(error)

    }
});

module.exports = employeeRouter;
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required :[true, "Entrez le nom de l'employé"]
    }, 
    firstName:{
        type : String,
        required :[true,"Entrez le prénom de l'employé" ]
    },
    function:{
        type: String,
        required : [true,"Indiquez la fonction de cet employé"],
        validate: {
            validator: function(v){
                return /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/.test(v);
            }
        }
    },
    number_of_blames: { type : Number, validate: {
        validator: function(v){
            return /^\d+$/.test(v);
        }
    },
        default:0},

        photo: {
            type: String,
        }
})

const employeeModel = mongoose.model("employees", employeeSchema);
module.exports = employeeModel;
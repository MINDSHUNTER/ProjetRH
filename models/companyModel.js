const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
  business_name : {
    type: String,
    required : [true,"Indiquez le nom de votre entreprise."],
    validate: {
      validator: function(v){
          return /^[A-Za-zÀ-ÖØ-öø-ÿ '0-9-]{2,}$/.test(v);
      },
      message: "Veuillez entrer un nom valide"
  }
  },
  siret_number : {
    type: String,
    required : [true,"Entrez le numéro SIRET de votre entreprise."],
    validate: {
      validator: function(v){
          return /^\d{14}$/.test(v);
      },
      message: "Veuillez entrer un siret valide"
  }
  },
  business_manager : {
    type: String,
    required : [true,"Entrez le nom du directeur de l'entreprise."],
    validate: {
      validator: function(v){
          return /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/.test(v);
      },
      message: "Veuillez entrer un nom valide"
  }
  },
   email : {
    type: String,
    required : [true,"Entrezl'emaill'entreprise."],
    validate: {
      validator: function(v){
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Veuillez entrer une adresse mail valide"
  }
  },
  password : {
    type: String,
    required : [true,"Entrez votre mot de passe."],
    validate: {
      validator: function(v){
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
      },
      message: "Veuillez entrer un mot de passe valide"
  }
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees"
}],

});

companySchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash;
        next();
    });
});


const companyModel = mongoose.model("company", companySchema);
module.exports = companyModel;
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true, useUnifiedTopology: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));

const userSchema =new mongoose.Schema({
    email : String,
    password : String
});

const secret = process.env.SECRET;
 
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]
});
const User = new mongoose.model("User", userSchema); 


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login")
});

app.get("/register", function(req,res){
    res.render("register");
});



app.post("/register", function(req,res){
const newUser = new User({
    email : req.body.username,
    password : req.body.password
});
newUser.save(function(err){
    if(err){
        console.log(err)
    }
    else{
        res.render("secrets");
    }
})
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username}, function(err, findOut){
        if(err){
            console.log(err);
        }
        else{
            if(findOut){
                if (findOut.password === password){
                    res.render("secrets");
                }
                else{
                    res.send("Sorry! Please Register");
                }
            }
        }
    });

});

app.listen(3000, function(){
    console.log("Server Started on Port 3000");
})
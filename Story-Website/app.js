const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("index");
});

app.post("/signup",function(req,res){
  res.render("signup",{missMatch:""});
});

app.post("/login",function(req,res){
  const password=req.body.password;
  const confirmPassword=req.body.confirm_password;
  if(password===confirmPassword){
    res.render("login");
  }else{
    res.render("signup",{missMatch:"Passwords doesn't match, Please try again!"});
  }
});

app.post("/home",function(req,res){
  res.render("Home");
});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});

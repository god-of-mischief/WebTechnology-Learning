const express=require("express");
const app=express();

app.get("/",function(req,res){
  res.send("<h1>Hello World !</h1>");
});
app.get("/contact",function(req,res){
  res.send("Contact me at: lokeshnamala95@gmail.com");
});
app.get("/about",function(req,res){
  res.send("<center><h1>Founder of <em>'Enthralling Stories'</em>.</h1><p>Thanks for being here. You can call me Loki. I love coding and building things. I built this site because I want you to know me and what my future projects are about. STAY CONNECTED</p><h1>My Skills.</h1><h2>Programming</h2><p>I never thought I would love something this much though I hate it at the same time. Initially I am not a coding person, but over time with one of my friends compulsion I started programming. And now I can't leave it. It's kinda fun. You must try it.</p><h2>Web Developing</h2><p>I really love web deveolpment. We can actually create anything. It helps to bring out the creativity in us. In future I'm going to build lot and lot of websites. Example : A books site like Amazon. A site for book lovers where you can write and get feedback. And finally I want to build my own game using only web.</p></center>")
});
app.get("/hobbies",function(req,res){
  res.send("<ul><li>Reading Books</li><li>Watching Movies</li></ul>")
})

app.listen(3000,function(){
  console.log("Server started on port:3000");
});

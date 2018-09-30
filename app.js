/* Practice by JERRY, created on 2018/7/15*/
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const frontend = require("./routes/frontend");
const backend = require("./routes/backend");
const user = require("./routes/user");
const init = require("./init");

// const cookieParser = require("cookie-parser");
const session = require("express-session");
const session_opt = {
    "secret" : "knowface123",
    "resave" : false,
    "saveUninitialized" : true,
    "name" : "kface",
    "cookie" : {
        // maxAge : 90000,
        httpOnly : true,
    },
};

let app = express();

app.use(express.static('./public'));
app.set('views','./views');
app.set('views engine','ejs');
app.use(session(session_opt));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

init.init();


/*app.get('/',function(req,res){
    res.set('Content-Type','text/html');
        // res.render('homepage.ejs',{"topmenu_left":{"leftmenu_1":["首页","/home"],"leftmenu_2":["测试","test"]}});
    // res.send("<script>alert('hello script!')</script>")
    res.render("frame.ejs",{"title":{"urlpath":req.path}});
});*/

app.use("/admin",backend);
app.use("/user",user);
app.use("/",frontend);

app.get('/registration',function(req,res){
    res.set('Content-Type','text/html');
    console.log(req.path);
    res.render("frame.ejs",{"urlpath":{"path":req.path}});
});

app.listen(8080);

/* Practice by JERRY, created on 2018/7/22*/
const express = require('express');
const f_controller = require("../controllers/frontend_controller");
let frontend = express.Router();

// frontend.get('/*',function (req,res, next) {
//     if (!req.session.visitorId) {
//         req.session.visitorId = Number(new Date());
//     }
//     next();
// });

frontend.get("/", f_controller.showHome);
frontend.get("/favicon",f_controller.favicon);
frontend.get("/p_signup", f_controller.p_signup);
frontend.post("/p_signup/adduser", f_controller.p_signup_adduser);
frontend.get("/p_login", f_controller.p_login);
frontend.post("/p_login/login", f_controller.p_login_login);
frontend.get("/p_matchdoc", f_controller.p_matchDoc);
frontend.post("/p_matchdoc/tomatch", f_controller.p_matchDoc_toMatch);
frontend.get("/p_chkmatch",f_controller.p_chkMatch);
frontend.get("/chkmatch",f_controller.chkMatch);
frontend.get("/p_docs",f_controller.p_docs);
frontend.get("/p_usermsg",f_controller.p_userMsg);
frontend.get("/img/:id",f_controller.showPrivacyImg);
frontend.post("/save_upper",f_controller.saveUpper);
frontend.get("/random_docs", f_controller.randomDocs);
frontend.get("/chkusername", f_controller.chkUsername);


module.exports = frontend;
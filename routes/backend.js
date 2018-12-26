/* Practice by JERRY, created on 2018/7/31*/
const express = require("express");
const a_controller = require("../controllers/admin_controller");
let backend = express.Router();

backend.get("/", a_controller.admin);
backend.get("/p_usermanage", a_controller.userManage);
backend.get("/p_updateuser", a_controller.updateUser);
backend.get("/p_addadmin", a_controller.addAdmin);
backend.get("/p_docmanage", a_controller.docManage);
backend.get("/p_updatedoc", a_controller.updateDoc);
backend.get("/p_matchmanage", a_controller.matchManage);
backend.get("/p_msgmanage", a_controller.msgManage);
backend.get("/p_sendmsg", a_controller.sendMsg);
backend.get("/p_accessmanage", a_controller.accessManage);
backend.get("/access/:resource", a_controller.access); //query
backend.post("/access/:resource", a_controller.access); //update_insert
backend.delete("/access/:resource", a_controller.access); //update_delete
backend.put("/access/:resource", a_controller.access); //update_delete
backend.post("/login", a_controller.login);
backend.get("/logout", a_controller.logout);
backend.get("/p_operatorinfo", a_controller.operatorInfo);
backend.post("/modifypwd", a_controller.modifyPwd);
backend.get("/usercrud",a_controller.userCrud);
backend.put("/usercrud",a_controller.userCrud);
backend.delete("/usercrud",a_controller.userCrud);
backend.get("/doccrud",a_controller.docCrud);
backend.delete("/doccrud",a_controller.docCrud);
backend.get("/image/:dir/:filename",a_controller.showImage);
backend.get("/image/:dir/:subdir/:filename",a_controller.showImage);
backend.get("/image/:dir/:subdir/:matched/:filename",a_controller.showImage);
backend.get("/matchedfile",a_controller.matchedFile);
backend.get("/imagebymatched",a_controller.showImageByMatched);


module.exports = backend;
/* Practice by JERRY, created on 2018/7/24*/
const express = require("express");
const user = express.Router();
const u_controller = require("../controllers/users_controller");


user.get("/p_userhome",u_controller.p_userHome);
user.get("/p_userdocs",u_controller.p_userDocs);
user.get("/p_createdoc",u_controller.p_createDoc);
user.get("/p_updatedoc",u_controller.p_updateDoc);
user.get("/p_usermsg", u_controller.p_userMsg);
user.get("/usermsg", u_controller.userMsgCrud);
user.put("/usermsg", u_controller.userMsgCrud);
user.delete("/usermsg", u_controller.userMsgCrud);
user.get("/p_usermsg/getmsg/:id", u_controller.p_userMsg_getMsg);
user.get("/p_userinfo",u_controller.p_userInfo);
user.post("/p_updateuserinfo",u_controller.p_updateUserInfo);
user.get("/p_logout",u_controller.p_logout);
user.post("/p_createdoc/save",u_controller.p_createDoc_save);
user.get("/p_createdoc/exit",u_controller.p_createDoc_exit);
user.get("/image/:username/:dir/:filename", u_controller.showImg);
user.get("/image/:username/:filename", u_controller.showImg);
user.post("/p_userdocs/deletedoc", u_controller.p_userDocs_deleteDoc);
user.get("/p_readdoc", u_controller.p_readDoc);
user.get("/p_readdoc/faceframe", u_controller.p_readDoc_faceFrame)
user.get("p_updatedoc", u_controller.p_updateDoc);
user.get("/p_updatedoc/exit", u_controller.p_updateDoc_exit);
user.post("/p_updatedoc/save", u_controller.p_updateDoc_save);


module.exports = user;
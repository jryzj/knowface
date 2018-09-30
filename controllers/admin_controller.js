/* Practice by JERRY, created on 2018/7/31*/


module.exports = {
    admin : function (req, res) {
        console.log("backend/admin");
        console.log(req.path);
        res.set("Content-Type","text/html");
        res.render("frame.ejs",{"urlpath":{"path":req.baseUrl+req.path}});
    },
    userManage : function (req, res) {
        console.log("backend/admin/userManage");
        res.set("Content-Type","text/html");
        res.render("frame.ejs",{"urlpath":{"path":req.baseUrl+req.path}});
    },
    updateUser : function (req, res) {
        console.log("backend/admin/updateUser");
    },
    addAdmin : function (req, res) {
        console.log("backend/admin/addAdmin");
    },
    docManage : function (req, res) {
        console.log("backend/admin/docManage");
    },
    updateDoc : function (req, res) {
        console.log("backend/admin/updateDoc");
    },
    matchManage : function (req, res) {
        console.log("backend/admin/matchManage");
    },
    msgManage : function (req, res) {
        console.log("backend/admin/msgManage");
    },
    sendMsg : function (req, res) {
        console.log("backend/admin/sendMsg");
    },
    logout : function (req, res) {
        console.log("backend/admin/logout");
    }
}
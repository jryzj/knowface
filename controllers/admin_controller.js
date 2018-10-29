/* Practice by JERRY, created on 2018/7/31*/
const Ac = require("../lib/accessControl.js");
const Dao = require("../models/mongooseDao");
const ac = new Ac.accessControl("mongoose", Dao.db, "../acPreset.js", "ac_");
const funcs = require("../lib/funcs");

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
    accessManage : function(req, res){
        console.log("backend/admin/accessManage");
        res.set("Content-Type","text/html");
        console.log(req.baseUrl,req.path);
        res.render("frame.ejs",{"urlpath": req.baseUrl + req.path});
    },
    access : function(req, res){
        console.log("backend/admin/access");
        console.log(req.method);
        // console.log(req);
        switch (req.params.resource) {
            case "group":
                console.log("case group");
                switch (req.method) {
                    case "GET" :
                        //查询现有的group
                        // let groupSkip = req.query.groupSkip;
                        // let groupLimit = req.query.groupLimit;
                        console.log("get group");
                        (async function () {
                            let doc = await ac.Group.find({});
/*                            let data = [];
                            for (let i = 0, length = doc.length; i < length; i++) {
                                    let d = {};
                                    d.id = doc[i]._id;
                                    d.name = doc[i].groupname;
                                    d.dataSchema = doc[i].dataSchema;
                                    data.push(d);
                            }*/
                            console.log(doc);
                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", data: doc, groupname : ac.DataSchema});
                        })();
                        break;
                    case "POST":
                        //增加分组名称
                        console.log("post_insert group");
                        (async function () {
                            console.log(req.body);
                            //增加的数据在req.body中，结构为{ name: 'test', dataSchema: 'test' }
                            //检查dataSchema是否合规
                            if (ac.dataSchemaValid(req.body.dataSchema)) {
                                if ((await ac.Group.find(req.body)).length == 0) {
                                    let result = await ac.Group.create(req.body);
                                    console.log(result);
                                    if (result.nModified != 0) {
                                        res.set("Content-Type", "application/json");
                                        res.send({state : "ok", result : ""});
                                    }
                                    else {
                                        res.set("Content-Type", "application/json");
                                        res.send({state : "error", result : "保存错误，请重试！"});
                                    }
                                } else {
                                    res.set("Content-Type", "application/json");
                                    res.send({state : "error", result : "数据重复！"});
                                }
                            } else {
                                res.set("Content-Type", "application/json");
                                res.send({state : "error", result : "数据模型不合规，请输入user、role、resource、rule、process之一！"});
                            }
                        })();
                        break;
                    case "DELETE" :
                        //删除一个分组名称
                        console.log("delete group");
                        console.log(req.body);
                        // console.log(req);
                        (async function() {
                            if (!module.exports.isUsed(req.body, "group")) {
                                let result = await ac.Group.remove(req.body);
                                console.log(result);
                                if (result.nModified != 0) {
                                    res.set("Content-Type", "application/json");
                                    res.send({state: "ok", result: ""});
                                }
                                else {
                                    res.set("Content-Type", "application/json");
                                    res.send({state: "error", result: "删除出错，请重试！"});
                                }
                            }
                        })();
                        break;
                }
                break;
            case "access" :

                break;
            case "operatorrole":

                break;
            case "rule":

                break;
            case "process":

                break;
            case "resource":

                break;
            case "role":

                break;
            case "operator":
                console.log("case operator");
                switch(req.method) {
                    case "GET" :
                        console.log("get operator");
                        (async function(){
                            let result = await ac.Operator.find({},"_id operator password");
                            console.log(result);
                            res.set("Content-Type","application/json");
                            res.send(result);
                        })();
                        break;
                    case "POST" :
                        console.log("post operator");
                        console.log(req.body);
                        (async function () {
                            let result = await ac.Operator.find({operator: req.body.operator});
                            if (result.length == 0) {
                                req.body.password = funcs.enCrypto(req.body.password);
                                result = await ac.Operator.create(req.body);
                                console.log(result);
                                if (JSON.stringify(result) != {}) {
                                    res.set("Content-Type", "application/json");
                                    res.send({state : "ok", result : result});
                                } else {
                                    res.set("Content-Type", "application/json");
                                    res.send({state : "error", result : "创建operator出错，请重试!"});
                                }
                            } else {
                                res.set("Content-Type", "application/json");
                                res.send({state : "error", result : "operator名已存在，请更换为其他名字!"});
                            }
                        })();
                        break;
                    case "DELETE" :
                        console.log("delete operator");
                        console.log(req.body);
                        (async function(){
                            let result = await ac.Operator.deleteOne({_id : req.body._id});
                            console.log("result:",result);
                            if(result.ok == 1){
                            res.set("Content-Type", "text/html");
                            res.send("ok");}else{
                                res.set("Content-Type", "text/html");
                                res.send("删除出错，请重试！");
                            }
                        })();
                        break;
                    case "PUT" :
                        console.log("put operator");
                        console.log(req.body);
                        (async function () {
                            req.body.password = funcs.enCrypto(req.body.password);
                            let result = await ac.Operator.update({_id: req.body._id},req.body);
                            console.log(result);
                            if (result.nModified > 0){
                                res.set("Content-Type", "application/json");
                                res.send({state : "ok", result : ""});
                            }else {
                                res.set("Content-Type", "application/json");
                                res.send({state : "error", result : "修改失败，请重试！"});
                            }


                   /*         if (result.length == 0) {
                                result = await ac.Operator.create(req.body);
                                console.log(result);
                                if (JSON.stringify(result) != {}) {
                                    res.set("Content-Type", "text/html");
                                    res.send("ok");
                                } else {
                                    res.set("Content-Type", "text/html");
                                    res.send("创建operator出错，请重试!");
                                }
                            } else {
                                res.set("Content-Type", "text/html");
                                res.send("operator名已存在，请更换为其他名字!");
                            }*/
                        })();

                        break;
                }
                break;
            case "operatorGroup":
                console.log("case operatorGroup");
                switch(req.method){
                    case "GET" :
                        console.log("get operatorGroup");
                        //查询现有的operator group
                        (async function () {
                            let doc = await ac.OperatorGroup.find({});
                            console.log(doc);
                           /* let data = [];
                            for (let i = 0, length = doc.length; i < length; i++) {
                                    let d = {};
                                    d.id = doc[i]._id;
                                    d.operatorGroup = doc[i].operatorGroup;
                                    d.operator = doc[i].operator;
                                    data.push(d);                                
                            }*/
                            let g = await ac.Group.find({dataSchema : "operator"});
                             let groupname = [];
                             for (let i = 0, length = g.length; i < length; i++) {
                                 groupname.push(g[i].groupname);
                             }

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc, groupname : groupname});
                        })();

                        break;
                    case "POST" :
                        console.log("post operatorGroup");
                        console.log(req.body);
                        (async function () {
                            let result, state, doc;
                            doc = await ac.Operator.find({operator : req.body.operator});

                            if (!doc.length)
                            {
                                state = "error";
                                result = "operator用户不存在!";
                            }else{
                                doc = await ac.OperatorGroup.find(req.body);
                                if(doc.length){
                                    state = "error";
                                    result = "operator已经属于该用户组，请更换为其他名字!";
                                }else{
                                    doc = await ac.OperatorGroup.create(req.body);
                                    console.log(doc);
                                    if (JSON.stringify(doc) != {}) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "设置operator的用户组出错，请重试!";
                                    }
                                }
                            }
                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put operatorGroup");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "operatorGroup")){
                                //check if the doc is duplicating.
                                let doc = await ac.OperatorGroup.find({operator : req.body.operator, operatorGroup : req.body.operatorGroup});
                                if(!doc.length){
                                    doc = await ac.OperatorGroup.update({_id : req.body._id}
                                                , {operatorGroup : req.body.operatorGroup});
                                    console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                    if (doc.nModified != 0) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "修改operator的用户组出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                    result = "设置operator的用户组已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "operator的用户组在使用中，不能修改!";
                            }


                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete operatorGroup");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "operatorGroup")){
                                doc = await ac.OperatorGroup.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除operator的用户组设置出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "operator的用户组在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();



                        break;

                }

                break;
        }

    },
    logout : function (req, res) {
        console.log("backend/admin/logout");
    },
    isUsed : function(doc, schema){
        //before delete doc, to check if the portifolio is used.
        //return 1 for used, return 0 for not used, return -1 for error
        let used;
        switch (schema){
            case  "operator":
                //should check operatorGroup, operator_role

                break;
            case "operatorGroup":
                //should check operator_role

                used = 0;
                break;
            case "group":
                used = 0;
                break;
        }

        return used;
    }
}
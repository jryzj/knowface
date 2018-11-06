/* Practice by JERRY, created on 2018/7/31*/
const Ac = require("../lib/accessControl.js");
const Dao = require("../models/mongooseDao");
const ac = new Ac.accessControl("mongoose", Dao.db, "../acPreset.js", "ac_");
const funcs = require("../lib/funcs");
const userUser = Dao.User;

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
            case "role":
                console.log("case role");

                switch(req.method){
                    case "GET" :
                        console.log("get role");
                        //查询现有的role
                        (async function () {
                            let doc = await ac.Role.find({});
                            console.log(doc);
                            let g = await ac.Group.find({dataSchema : "role"});
                            let groupname = [];
                            for (let i = 0, length = g.length; i < length; i++) {
                                groupname.push(g[i].groupname);
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc, groupname : groupname});
                        })();

                        break;
                    case "POST" :
                        console.log("post role");
                        console.log(req.body);
                        (async function () {
                            let result, state, doc;
                            doc = await ac.Role.find(req.body);
                            if(doc.length){
                                state = "error";
                                result = "role已经属于该分组!";
                            }else{
                                doc = await ac.Role.create(req.body);
                                console.log(doc);
                                if (JSON.stringify(doc) != {}) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "设置role出错，请重试!";
                                }
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put role");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "role")){
                                //check if the doc is duplicating.
                                let doc = await ac.Role.find({role : req.body.role, roleGroup : req.body.roleGroup});
                                if(!doc.length){
                                    doc = await ac.Role.update({_id : req.body._id}
                                        , {role : req.body.role, roleGroup : req.body.roleGroup});
                                    console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                    if (doc.nModified != 0) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "修改role组出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                    result = "该role组已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该role组在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete role");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "role")){
                                doc = await ac.Role.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除role组出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "role组在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }

                break;
            case "resource":
                console.log("case resource");

                switch(req.method){
                    case "GET" :
                        console.log("get resource");
                        //查询现有的resource
                        (async function () {
                            let doc = await ac.Resource.find({});
                            console.log(doc);
                            let g = await ac.Group.find({dataSchema : "resource"});
                            let groupname = [];
                            for (let i = 0, length = g.length; i < length; i++) {
                                groupname.push(g[i].groupname);
                            }
                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc, groupname : groupname});
                        })();

                        break;
                    case "POST" :
                        console.log("post resource");
                        console.log(req.body);
                        (async function () {
                            let result, state, doc;
                            doc = await ac.Resource.find(req.body);
                            if(doc.length){
                                state = "error";
                                result = "resource已经用同样设置!";
                            }else{
                                doc = await ac.Resource.create(req.body);
                                console.log(doc);
                                if (JSON.stringify(doc) != {}) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "设置resource出错，请重试!";
                                }
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put resource");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "resource")){
                                //check if the doc is duplicating.
                                let doc = await ac.Resource.find({resource : req.body.resource
                                    , exp : req.body.exp, resourceKind : req.body.resourceKind, dynamic : req.body.dynamic
                                    , container : req.body.container, resourceGroup : req.body.resourceGroup});
                                if(!doc.length){
                                    doc = await ac.Resource.update({_id : req.body._id}
                                        , {resource : req.body.resource
                                            , exp : req.body.exp, resourceKind : req.body.resourceKind, dynamic : req.body.dynamic
                                            , container : req.body.container, resourceGroup : req.body.resourceGroup});
                                    console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                    if (doc.nModified != 0) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "修改resource出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                    result = "该resource已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该resource在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete resource");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "resource")){
                                doc = await ac.Resource.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除resource设置出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "resource设置在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }

                break;
            case "process":

                break;
            case "rule":

                console.log("case rule");

                switch(req.method){
                    case "GET" :
                        console.log("get rule");
                        //查询现有的rule
                        (async function () {
                            let doc = await ac.Rule.find({});
                            console.log(doc);
                            let g = await ac.Group.find({dataSchema : "rule"});
                            let groupname = [];
                            for (let i = 0, length = g.length; i < length; i++) {
                                groupname.push(g[i].groupname);
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc, groupname : groupname});
                        })();

                        break;
                    case "POST" :
                        console.log("post rule");
                        console.log(req.body);
                        (async function () {
                            let result, state, doc;
                            doc = await ac.Rule.find(req.body);
                            if(doc.length){
                                state = "error";
                                result = "该rule已经存在!";
                            }else{
                                doc = await ac.Rule.create(req.body);
                                console.log(doc);
                                if (JSON.stringify(doc) != {}) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "设置rule出错，请重试!";
                                }
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put rule");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "rule")){
                                //check if the doc is duplicating.
                                let doc = await ac.Rule.find({rule : req.body.rule, ruleType : req.body.ruleType
                                    ,procRes : req.body.procRes, procResType : req.body.procResType
                                    ,operation : req.body.operation});
                                if(!doc.length){
                                    doc = await ac.Rule.update({_id : req.body._id}
                                        , {rule : req.body.rule, ruleType : req.body.ruleType
                                            ,procRes : req.body.procRes, procResType : req.body.procResType
                                            ,operation : req.body.operation});
                                    console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                    if (doc.nModified != 0) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "修改rule出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                    result = "该rule已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该rule在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete rule");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "role")){
                                doc = await ac.Rule.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除rule出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "rule在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }

                break;
            case "userrole":

                console.log("case userrole");

                switch(req.method){
                    case "GET" :
                        console.log("get userrole");
                        //查询现有的rule
                        (async function () {
                            let doc = await ac.UserRole.find({});
                            console.log(doc);

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc});
                        })();

                        break;
                    case "POST" :
                        console.log("post userrole");
                        console.log(req.body);
                        (async function () {
                            let result="", state, doc;
                            //check if the data portfoilo is existing in UserRole
                            doc = await ac.UserRole.find(req.body);

                            if(doc.length){
                                state = "error";
                                result = "该userrole已经存在!";
                            }else{
                                //check if user or group is existing in User, or operator or group is existing in Role
                                switch(req.body.userType){
                                    case "user" :
                                        doc = await userUser.find({username : req.body.user});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "usergroup" :
                                        doc = await userUser.find({group : req.body.user});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "operator" :
                                        doc = await ac.Operator.find({operator : req.body.user});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "operatorgroup" :
                                        doc = await ac.OperatorGroup.find({operatorGroup : req.body.user});
                                        if(!doc.length) result = "用户组不存在.";
                                        break;
                                }

                                //check if role or group is existing in role
                                switch(req.body.roleType){
                                    case "role" :
                                        doc = await ac.Role.find({role : req.body.role});
                                        if(!doc.length) result += "角色不存在.";
                                        break;
                                    case "group" :
                                        doc = await ac.Role.find({roleGroup : req.body.role});
                                        if(!doc.length) result += "角色组不存在.";
                                        break;
                                }

                                if(!result.length){
                                    doc = await ac.UserRole.create(req.body);
                                    console.log(doc);
                                    if (JSON.stringify(doc) != {}) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "设置userrole出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                }
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put userrole");
                        console.log(req.body);
                        (async function(){
                            let result="", state, doc=[];
                            if(!module.exports.isUsed(req.body, "userrole")){
                                //check if the doc is duplicating.
                                let doc = await ac.UserRole.find({user : req.body.user, userType : req.body.userType
                                    ,role : req.body.role, roleType : req.body.roleType});
                                if(!doc.length){

                                    //check if user or group is existing in User, or operator or group is existing in Role
                                    switch(req.body.userType){
                                        case "user" :
                                            doc = await userUser.find({username : req.body.user});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "usergroup" :
                                            doc = await userUser.find({group : req.body.user});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "operator" :
                                            doc = await ac.Operator.find({operator : req.body.user});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "operatorgroup" :
                                            doc = await ac.OperatorGroup.find({operatorGroup : req.body.user});
                                            if(!doc.length) result = "用户组不存在.";
                                            break;
                                    }

                                    //check if role or group is existing in role
                                    switch(req.body.roleType){
                                        case "role" :
                                            doc = await ac.Role.find({role : req.body.role});
                                            if(!doc.length) result += "角色不存在.";
                                            break;
                                        case "group" :
                                            doc = await ac.Role.find({roleGroup : req.body.role});
                                            if(!doc.length) result += "角色组不存在.";
                                            break;
                                    }

                                    if(!result.length) {
                                        doc = await ac.UserRole.update({_id : req.body._id}
                                            , {user : req.body.user, userType : req.body.userType
                                                ,role : req.body.role, roleType : req.body.roleType});
                                        console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                        if (doc.nModified != 0) {
                                            state = "ok";
                                            result = doc;
                                        } else {
                                            state = "error";
                                            result = "修改userrole出错，请重试!";
                                        }
                                    }



                                }else{
                                    state = "error";
                                    result = "该userrole设置已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该userrole在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete userrole");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "userrole")){
                                doc = await ac.UserRole.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除userrole出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "该userrole设置在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }

                break;
            case "access" :

                console.log("case access");

                switch(req.method){
                    case "GET" :
                        console.log("get access");
                        //查询现有的rule
                        (async function () {
                            let doc = await ac.Access.find({});
                            console.log(doc);

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc});
                        })();

                        break;
                    case "POST" :
                        console.log("post access");
                        console.log(req.body);
                        (async function () {
                            let result="", state, doc;
                            //check if the data portfoilo is existing in access
                            doc = await ac.Access.find(req.body);

                            if(doc.length){
                                state = "error";
                                result = "该access已经存在!";
                            }else{
                                //check if rule or group is existing in rule
                                switch(req.body.ruleType){
                                    case "rule" :
                                        doc = await ac.Rule.find({rule : req.body.rule});
                                        if(!doc.length) result = "规则不存在.";
                                        break;
                                    case "group" :
                                        doc = await ac.Rule.find({ruleType : req.body.rule});
                                        if(!doc.length) result = "规则组不存在.";
                                        break;
                                }

                                //check if user or operator or group is existing in Role
                                switch(req.body.roleType){
                                    case "user" :
                                        doc = await userUser.find({username : req.body.role});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "usergroup" :
                                        doc = await userUser.find({group : req.body.role});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "operator" :
                                        doc = await ac.Operator.find({operator : req.body.role});
                                        if(!doc.length) result = "用户不存在.";
                                        break;
                                    case "operatorgroup" :
                                        doc = await ac.OperatorGroup.find({operatorGroup : req.body.role});
                                        if(!doc.length) result = "用户组不存在.";
                                        break;
                                    case "role" :
                                        doc = await ac.Role.find({role : req.body.role});
                                        if(!doc.length) result += "角色不存在.";
                                        break;
                                    case "rolegroup" :
                                        doc = await ac.Role.find({roleGroup : req.body.role});
                                        if(!doc.length) result += "角色组不存在.";
                                        break;
                                }

                                if(!result.length){
                                    doc = await ac.Access.create(req.body);
                                    console.log(doc);
                                    if (JSON.stringify(doc) != {}) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "设置access出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                }
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put access");
                        console.log(req.body);
                        (async function(){
                            let result="", state, doc=[];
                            if(!module.exports.isUsed(req.body, "access")){
                                //check if the doc is duplicating.
                                let doc = await ac.Access.find({user : req.body.user, userType : req.body.userType
                                    ,role : req.body.role, roleType : req.body.roleType, whitelist : req.body.whitelist});
                                if(!doc.length){
                                    //check if rule or group is existing in rule
                                    switch(req.body.ruleType){
                                        case "rule" :
                                            doc = await ac.Rule.find({rule : req.body.rule});
                                            if(!doc.length) result = "规则不存在.";
                                            break;
                                        case "group" :
                                            doc = await ac.Rule.find({ruleType : req.body.rule});
                                            if(!doc.length) result = "规则组不存在.";
                                            break;
                                    }

                                    //check if role or group is existing in role
                                    switch(req.body.roleType){
                                        case "user" :
                                            doc = await userUser.find({username : req.body.role});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "usergroup" :
                                            doc = await userUser.find({group : req.body.role});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "operator" :
                                            doc = await ac.Operator.find({operator : req.body.role});
                                            if(!doc.length) result = "用户不存在.";
                                            break;
                                        case "operatorgroup" :
                                            doc = await ac.OperatorGroup.find({operatorGroup : req.body.role});
                                            if(!doc.length) result = "用户组不存在.";
                                            break;
                                        case "role" :
                                            doc = await ac.Role.find({role : req.body.role});
                                            if(!doc.length) result += "角色不存在.";
                                            break;
                                        case "rolegroup" :
                                            doc = await ac.Role.find({roleGroup : req.body.role});
                                            if(!doc.length) result += "角色组不存在.";
                                            break;
                                    }

                                    if(!result.length) {
                                        doc = await ac.Access.update({_id : req.body._id}
                                            , {user : req.body.user, userType : req.body.userType
                                                ,role : req.body.role, roleType : req.body.roleType, whitelist : req.body.whitelist});
                                        console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                        if (doc.nModified != 0) {
                                            state = "ok";
                                            result = doc;
                                        } else {
                                            state = "error";
                                            result = "修改access出错，请重试!";
                                        }

                                    }





                                }else{
                                    state = "error";
                                    result = "该access设置已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该access在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete access");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "access")){
                                doc = await ac.Access.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除access出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "该access设置在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }
                
                
                break;
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

            case "overview" :

                console.log("case overview");

                switch(req.method){
                    case "GET" :
                        console.log("get access");
                        //1, check if the user is valid, user for frontend, operator for backend.
                        //      there has possibility name are same for user, operator, usergroup, role, role group.
                        //2, which group is the user belong to? userGroup = []
                        //3, which role is the user  belong to? role = [];
                        //4, which roleGroup is the user belong to? roleGroup = []
                        //5, which access is the user associated? accessId = [{id, "whitelist or blacklist"}];
                        //6, which ruleType is the access consist of? ruleType =[]
                        //7, which rule is the access consist of?  rule = []
                        //8, which resourceType can the access visit? resourceType = []
                        //9, which resource can the access visit? resource = [{resousceId, operation，whitelist or blacklist}]

                        (async function () {
                            let result="", state;
                            let doc, userGroup, role, roleGroup;

                            //step 1
                            if (req.body.user == "operator"){
                                doc = await ac.operator.find({operator : req.body.user});
                            }else
                                doc = await ac.userUser.find({username : req.body.user});

                            if(doc.length){
                                userGroup = [];

                                //step 2
                                if(req.body.user == "operator"){
                                    doc = await ac.OperatorGroup.find({operator : req.body.user});
                                    if (doc.length){
                                        for(let i = 0, length = doc.length; i < length; i++){
                                            userGroup.push(doc[i].operatorGroup);
                                        }
                                    }
                                }else{
                                    doc = await ac.userUser.find({username : req.body.user});
                                    if (doc.length){
                                        for(let i = 0, length = doc.length; i < length; i++){
                                            userGroup.push(doc[i].group);
                                        }
                                    }
                                }

                                //step 3 and 4
                                if(req.body.user === "operator") {
                                    doc = await ac.userRole.find({
                                        $or: [{
                                            user: {$in: userGroup}
                                            , userType: "operatorgroup"
                                        }, {user: req.body.user, userType: "operator"}]
                                    });
                                }else{
                                    doc = await ac.userRole.find({
                                        $or: [{
                                            user: {$in: userGroup}
                                            , userType: "operatorgroup"
                                        }, {user: req.body.user, userType: "user"}]
                                    });
                                }

                                    if(doc.length){
                                    role = [], roleGroup =[];
                                    for (let i = 0, length = doc.length; i < length; i ++){
                                        if (doc[i].roleType === "role"){
                                            role.push(doc[i].role);
                                        }else
                                            roleGroup.push(doc[i].role)
                                    }
                                }

                                //step 5, 6, 7









                            }else{
                                state = "error";
                                result = "用户名不存在!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state: state, result: result});
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
                //should check operatorGroup, userrole before delete

                break;
            case "operatorGroup":
                //should check userole before delete

                used = 0;
                break;
            case "role":
                //should check access, userrole before delete
                used = 0;
            case "userrole":
                //should check access
                used = 0;
                break;
            case "group":
                //should check according dataschema
                used = 0;
                break;
        }

        return used;
    }
}
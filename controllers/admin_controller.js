/* Practice by JERRY, created on 2018/7/31*/
const Ac = require("../lib/accessControl.js");
const Dao = require("../models/mongooseDao");
const ac = new Ac.accessControl("mongoose", Dao.db, "../acPreset.js", "ac_");
const funcs = require("../lib/funcs");
const userUser = Dao.User;
const fs = require("fs");
const util = require('util');
const formidable = require("formidable");
const co = require("co");

module.exports = {
    admin : function (req, res) {
        console.log("backend/admin");
        console.log(req.baseUrl,"-", req.path);
        res.set("Content-Type","text/html");
        res.render("frame.ejs",{"urlpath":req.baseUrl+req.path});
    },
    userManage : function (req, res) {
        console.log("backend/admin/userManage");
        let access;
        //1、to check session
        //2、to check the access permission
        //3、to render the page according the permission

        if (req.session.operator) {
            //2、to check the access permission
            (async function () {
                    access = await module.exports.accessRefine("/admin/p_usermanage", req.session.operator, "operator");
                    console.log(access);
                    if (access.result.mainResPro){
                        //3、to render the page according the permission
                        switch(req.method){
                            case "GET" :
                                console.log("GET   backend/admin/userManage");
                                access.proResList.urlpath = req.baseUrl + req.path;
                                access.proResList.operator = req.session.operator;

                                res.set("Content-Type", "text/html");
                                res.render("frame.ejs",access.proResList);
                                break;
                        }

                    }else{
                        res.set("Content-Type", "text/html");
                        res.send('page access denied!');
                    }
                }
            )();

        } else
        {res.set("Content-Type","text/html");
            res.send("login, pls!");}
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
        if(req.session.operator) {
            (async function(){
            let access = await module.exports.accessRefine("/admin/p_accessmanage", req.session.operator, "operator");
            console.log(access);
            if (access.result.mainResPro) {
                access.proResList.urlpath = req.baseUrl + req.path;
                access.proResList.operator = req.session.operator;
                res.set("Content-Type", "text/html");
                console.log(req.baseUrl, req.path);
                res.render("frame.ejs", access.proResList);
            }else{
                res.set("Content-Type", "text/html");
                res.send('page access denied!');
            }})();
        }else {
            res.set("Content-Type", "text/html");
            res.end("login, pls!");
        }
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
                                if (doc.length) {
                                    state = "error";
                                    result = "role已经属于该分组!";
                                } else {
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
                            if (doc.length) {
                                state = "error";
                                result = "rule已经属于该分组!";
                            } else {
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
                                let doc = await ac.Rule.find({rule : req.body.rule, ruleGroup : req.body.ruleGroup});
                                if(!doc.length){
                                    doc = await ac.Rule.update({_id : req.body._id}
                                        , {rule : req.body.rule, ruleGroup : req.body.ruleGroup});
                                    console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                    if (doc.nModified != 0) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "修改rule组出错，请重试!";
                                    }
                                }else{
                                    state = "error";
                                    result = "该rule组已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该rule组在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete rule");
                        console.log(req.body);
                        (async function(){
                            if(!module.exports.isUsed(req.body, "rule")){
                                doc = await ac.Rule.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除rule组出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "rule组在使用中，不能删除!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();
                        break;
                }

                break;              
            case "ruleprores":

                console.log("case ruleprores");

                switch(req.method){
                    case "GET" :
                        console.log("get ruleprores");
                        //查询现有的ruleprores
                        (async function () {
                            let doc = await ac.RuleProRes.find({});
                            console.log(doc);

                            res.set("Content-Type", "application/json");
                            res.send({state: "ok", result: doc});
                        })();

                        break;
                    case "POST" :
                        console.log("post ruleprores");
                        console.log(req.body);
                        (async function () {
                            let result, state, doc;
                            doc = await ac.RuleProRes.find(req.body);
                            if(doc.length){
                                state = "error";
                                result = "该ruleprores已经存在!";
                            }else{
                                //check if the rule is existing
                                result = "";
                                if(req.body.ruleType === "rule"){
                                    doc = await ac.Rule.find({rule : req.body.rule, ruleGroup : ""});
                                }else if (req.body.ruleType === "rulegroup")
                                    doc = await ac.Rule.find({ruleGroup : req.body.rule});

                                if(!doc.length) result += "规则或规则组不存在！";

                                if(req.body.procResType === "resource"){
                                    doc = await ac.Resource.find({resource : req.body.resource, resourceGroup : ""});
                                }else if (req.body.proResType === "resourcegroup")
                                    doc = await ac.Resource.find({resourceGroup : req.body.proRes});

                                if(!doc.length) result += "资源或资源组不存在！";

                                if(result.length === 0){
                                    doc = await ac.RuleProRes.create(req.body);
                                    console.log(doc);
                                    if (JSON.stringify(doc) != {}) {
                                        state = "ok";
                                        result = doc;
                                    } else {
                                        state = "error";
                                        result = "设置ruleprores出错，请重试!";
                                    }
                                }else
                                    state = "error";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "PUT" :
                        //when not used, equals to deleting and creating
                        console.log("put ruleprores");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "ruleprores")){
                                //check if the doc is duplicating.
                                let doc = await ac.RuleProRes.find({ruleprores : req.body.ruleprores, ruleproresType : req.body.ruleproresType
                                    ,proRes : req.body.proRes, procResType : req.body.procResType
                                    ,operation : req.body.operation});
                                if(!doc.length){
                                    result = "";
                                    if(req.body.ruleType === "rule"){
                                        doc = await ac.Rule.find({rule : req.body.rule, ruleGroup : ""});
                                    }else if (req.body.ruleType === "group")
                                        doc = await ac.Rule.find({ruleGroup : req.body.rule});

                                    if(!doc.length) result += "规则或规则组不存在！";

                                    if(req.body.procResType === "resource"){
                                        doc = await ac.Resource.find({resource : req.body.resource, resourceGroup : ""});
                                    }else if (req.body.proResType === "resourcegroup")
                                        doc = await ac.Resource.find({resource : req.body.proRes, resourceGroup : req.body.proResType});

                                    if(!doc.length) result += "资源或资源组不存在！";

                                    if(result.length === 0) {
                                        doc = await ac.RuleProRes.update({_id : req.body._id}
                                            , {ruleprores : req.body.ruleprores, ruleproresType : req.body.ruleproresType
                                                ,proRes : req.body.proRes, procResType : req.body.procResType
                                                ,operation : req.body.operation});
                                        console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                        if (doc.nModified != 0) {
                                            state = "ok";
                                            result = doc;
                                        } else {
                                            state = "error";
                                            result = "修改ruleprores出错，请重试!";
                                        }
                                    }


                                }else{
                                    state = "error";
                                    result = "该ruleprores已存在，请修改后重试!";
                                }
                            }else{
                                state = "error";
                                result = "该ruleprores在使用中，不能修改!";
                            }

                            res.set("Content-Type", "application/json");
                            res.send({state : state, result : result});
                        })();

                        break;
                    case "DELETE" :
                        console.log("delete ruleprores");
                        console.log(req.body);
                        (async function(){
                            let result, state, doc=[];
                            if(!module.exports.isUsed(req.body, "ruleprores")){
                                doc = await ac.RuleProRes.remove({_id : req.body._id});
                                console.log(doc); //{ n: 0, nModified: 0, ok: 1 }
                                if (doc.n != 0) {
                                    state = "ok";
                                    result = doc;
                                } else {
                                    state = "error";
                                    result = "删除ruleprores出错，请重试!";
                                }

                            }else{
                                state = "error";
                                result = "ruleprores在使用中，不能删除!";
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
                                        doc = await ac.Rule.find({ruleGroup : req.body.rule});
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
                                            doc = await ac.Rule.find({ruleGroup : req.body.rule});
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
                console.log(req.body);

                switch(req.method){
                    case "GET" :
                        console.log("get overview");
                        //1, check if the user is valid, user for frontend, operator for backend.
                        //      there has possibility name are same for user, operator, usergroup, role, role group.
                        //2, which group is the user belong to? userGroup = []
                        //3, which role is the user  belong to? role = [];
                        //4, which roleGroup is the user belong to? roleGroup = []
                        //5, which access is the user associated? access = [{id, "whitelist or blacklist"}];
                        //6, which ruleGroup is the access consist of? ruleGroup =[]
                        //7, which rule is the access consist of?  rule = []
                        //8, which resourceType can the access visit? resourceType = []
                        //9, which resource can the access visit? resource = [{resousceId, operation，whitelist or blacklist}]

                        // (async function () {
                        //                         //     let result="", state;
                        //                         //     let doc, userGroup, role, roleGroup, access, rule, ruleGroup, resource, resourceGroup;
                        //                         //     let items =[];
                        //                         //
                        //                         //     //step 1
                        //                         //     if (req.query.userType == "operator"){
                        //                         //         doc = await ac.Operator.find({operator : req.query.user});
                        //                         //     }else
                        //                         //         doc = await userUser.find({username : req.query.user});
                        //                         //
                        //                         //
                        //                         //     if(doc.length){
                        //                         //         userGroup = [];
                        //                         //
                        //                         //         //step 2
                        //                         //         if(req.query.userType == "operator"){
                        //                         //             doc = await ac.OperatorGroup.find({operator : req.query.user});
                        //                         //             if (doc.length){
                        //                         //                 for(let i = 0, length = doc.length; i < length; i++){
                        //                         //                     items.push({user : req.query.user, userGroup : doc[i].operatorGroup});
                        //                         //                     userGroup.push(doc[i].operatorGroup);
                        //                         //                 }
                        //                         //             }
                        //                         //         }else{
                        //                         //             doc = await userUser.find({username : req.query.user});
                        //                         //             if (doc.length){
                        //                         //                 for(let i = 0, length = doc.length; i < length; i++){
                        //                         //                     items.push({user : req.query.user, userGroup : doc[i].operatorGroup});
                        //                         //                     userGroup.push(doc[i].group);
                        //                         //                 }
                        //                         //             }
                        //                         //         }
                        //                         //
                        //                         //
                        //                         //         //step 3 and 4
                        //                         //         if(req.query.userType === "operator") {
                        //                         //             doc = await ac.UserRole.find({
                        //                         //                 $or: [{
                        //                         //                     user: {$in: userGroup}
                        //                         //                     , userType: "operatorgroup"
                        //                         //                 }, {user: req.query.user, userType: "operator"}]
                        //                         //             });
                        //                         //         }else{
                        //                         //             doc = await ac.UserRole.find({
                        //                         //                 $or: [{
                        //                         //                     user: {$in: userGroup}
                        //                         //                     , roleType: "usergroup"
                        //                         //                 }, {user: req.query.user, roleType: "user"}]
                        //                         //             });
                        //                         //         }
                        //                         //
                        //                         //             if(doc.length){
                        //                         //             role = [], roleGroup =[];
                        //                         //             for (let i = 0, length = doc.length; i < length; i ++){
                        //                         //                 if (doc[i].roleType === "role"){
                        //                         //                     role.push(doc[i].role);
                        //                         //                     let d = await ac.Role.find({role : doc[i].role});
                        //                         //                     if (d.length){
                        //                         //                         for(let i = 0, length =d.length; i < length; i++ ){
                        //                         //                             if(d[i].roleGroup !== ""){
                        //                         //                                 roleGroup.push(d[i].roleGroup);
                        //                         //                             }
                        //                         //                         }
                        //                         //                     }
                        //                         //                 }else
                        //                         //                     roleGroup.push(doc[i].role)
                        //                         //             }
                        //                         //         }
                        //                         //
                        //                         //         //step 5, 6, 7
                        //                         //         access = [], rule = [], ruleGroup = [];
                        //                         //         doc = await ac.Access.find({$or : [{ role : {$in : role}, roleType : "role"}
                        //                         //                                         , {role : {$in : roleGroup}, roleType : "rolegroup"}
                        //                         //                                         , {role : {$in : userGroup}, roleType : req.query.userType+"group"}
                        //                         //                                         , {role : req.query.user, roleType : req.query.userType}
                        //                         //             ]});
                        //                         //         if(doc.length){
                        //                         //             for(let i = 0, length = doc.length; i < length; i++){
                        //                         //                 // access.push({accessId : doc[i]._id, whitelist : doc[i].whitelist});
                        //                         //                 if(doc[i].ruleType === "rule"){
                        //                         //                     rule.push({rule : doc[i].rule, whitelist : doc[i].whitelist});
                        //                         //                     let d = await ac.Rule.find({rule : doc[i].rule});
                        //                         //                     if (d.length){
                        //                         //                         for(let j = 0, length =d.length; j < length; j++ ){
                        //                         //                             if(d[j].ruleGroup !== ""){
                        //                         //                                 ruleGroup.push({rule : d[j].rule, whitelist : doc[i].whitelist});
                        //                         //                             }
                        //                         //                         }
                        //                         //                     }
                        //                         //                 }else
                        //                         //                     ruleGroup.push({rule : doc[i].rule, whitelist : doc[i].whitelist});
                        //                         //             }
                        //                         //         }
                        //                         //
                        //                         //         //step 8, 9
                        //                         //         resource = [], resourceGroup =[];
                        //                         //         for(let i = 0, length = rule.length; i < length; i++){
                        //                         //             let doc= await ac.RuleProRes.find({rule : rule[i].rule, ruleType : "rule"});
                        //                         //             if(doc[0] && doc[0].proResType === "resource"){
                        //                         //                 resource.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : rule[i].whitelist });
                        //                         //             }else if(doc[0] && doc[0].proResType === "resourcegroup")
                        //                         //                 resourceGroup.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : rule[i].whitelist });
                        //                         //
                        //                         //         }
                        //                         //
                        //                         //         for(let i = 0, length = ruleGroup.length; i < length; i++){
                        //                         //             let doc= await ac.RuleProRes.find({rule : ruleGroup[i].rule, ruleType : "rulegroup"});
                        //                         //             if(doc[0] && doc[0].proResType === "resource"){
                        //                         //                 resource.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : ruleGroup[i].whitelist });
                        //                         //             }else if(doc[0] && doc[0].proResType === "resourcegroup")
                        //                         //                 resourceGroup.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : ruleGroup[i].whitelist });
                        //                         //
                        //                         //         }
                        //                         //
                        //                         //         for(let i = 0, length =resourceGroup.length; i < length; i++){
                        //                         //             let doc = await ac.Resource.find({resourceGroup : resourceGroup[i].proRes});
                        //                         //             for(let j=0, length = doc.length; j < length; j++){
                        //                         //                 resource.push({proRes : doc[j].resource, operation : resourceGroup[i].operation, whitelist : resourceGroup[i].whitelist });
                        //                         //             }
                        //                         //         }
                        //                         //
                        //                         //         state = "ok";
                        //                         //         result = resource;
                        //                         //
                        //                         //
                        //                         //     }else{
                        //                         //         state = "error";
                        //                         //         result = "用户名不存在!";
                        //                         //     }
                        //                         //
                        //                         //     res.set("Content-Type", "application/json");
                        //                         //     res.send({state: state, result: result});
                        //                         // })();

                        (async function(){
                            let result = await module.exports.checkAccess(req.query.user, req.query.userType)

                        res.set("Content-Type", "application/json");
                        res.send(result);

                    })();

                        break;

                }

                break;
        }

    },
    login : function(req, res){
        console.log("admin.login");
        console.log(req.body);
        //1、to match operator and password
        //2、set session
        (async function(){
            let result="";
            //1、to match operator and password
            let pwd =  funcs.enCrypto(req.body.password);
            let doc = await ac.Operator.find({operator : req.body.operator, password : pwd});
            if(doc.length > 0){
                //account and password matched
                //2、set session
                result = "ok";
                req.session.operator = req.body.operator;
                req.session.lastVisitTime = doc[0].lastVisitTime;
                await ac.Operator.update({operator : req.body.operator},{lastVisitTime : Date.now()});
            }else
                result = "account and password are not match!";

            res.set("Content-Type","text/html");
            res.end(result);
        })();

    },
    logout : function (req, res) {
        console.log("backend/admin/logout");
        delete req.session.operator;
        res.redirect("/admin");
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
            case "rule":
                //should check access, ruleprores before delete
                used = 0;
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
    },
    checkAccess : async function(user, userType){
        console.log("backend/admin/checkAccess");
            let result="", state;
            let doc, userGroup, role, roleGroup, access, rule, ruleGroup, resource, resourceGroup;
            let items =[];

        //1, check if the user is valid, user for frontend, operator for backend.
        //      there has possibility name are same for user, operator, usergroup, role, role group.
        //2, which group is the user belong to? userGroup = []
        //3, which role is the user  belong to? role = [];
        //4, which roleGroup is the user belong to? roleGroup = []
        //5, which access is the user associated? access = [{id, "whitelist or blacklist"}];
        //6, which ruleGroup is the access consist of? ruleGroup =[]
        //7, which rule is the access consist of?  rule = []
        //8, which resourceType can the access visit? resourceType = []
        //9, which resource can the access visit? resource = [{resousceId, operation，whitelist or blacklist}]
        //10, insert container in resource.

        //step 1
            if (userType == "operator"){
                doc = await ac.Operator.find({operator : user});
            }else
                doc = await userUser.find({username : user});


            if(doc.length){
                userGroup = [];

                //step 2
                if(userType == "operator"){
                    doc = await ac.OperatorGroup.find({operator : user});
                    if (doc.length){
                        for(let i = 0, length = doc.length; i < length; i++){
                            items.push({user : user, userGroup : doc[i].operatorGroup});
                            userGroup.push(doc[i].operatorGroup);
                        }
                    }
                }else{
                    doc = await userUser.find({username : user});
                    if (doc.length){
                        for(let i = 0, length = doc.length; i < length; i++){
                            items.push({user : user, userGroup : doc[i].operatorGroup});
                            userGroup.push(doc[i].group);
                        }
                    }
                }


                //step 3 and 4
                if(userType === "operator") {
                    doc = await ac.UserRole.find({
                        $or: [{
                            user: {$in: userGroup}
                            , userType: "operatorgroup"
                        }, {user: user, userType: "operator"}]
                    });
                }else{
                    doc = await ac.UserRole.find({
                        $or: [{
                            user: {$in: userGroup}
                            , roleType: "usergroup"
                        }, {user: user, roleType: "user"}]
                    });
                }

                if(doc.length){
                    role = [], roleGroup =[];
                    for (let i = 0, length = doc.length; i < length; i ++){
                        if (doc[i].roleType === "role"){
                            role.push(doc[i].role);
                            let d = await ac.Role.find({role : doc[i].role});
                            if (d.length){
                                for(let i = 0, length =d.length; i < length; i++ ){
                                    if(d[i].roleGroup !== ""){
                                        roleGroup.push(d[i].roleGroup);
                                    }
                                }
                            }
                        }else
                            roleGroup.push(doc[i].role)
                    }
                }

                //step 5, 6, 7
                access = [], rule = [], ruleGroup = [];
                doc = await ac.Access.find({$or : [{ role : {$in : role}, roleType : "role"}
                        , {role : {$in : roleGroup}, roleType : "rolegroup"}
                        , {role : {$in : userGroup}, roleType : userType+"group"}
                        , {role : user, roleType : userType}
                    ]});
                if(doc.length){
                    for(let i = 0, length = doc.length; i < length; i++){
                        // access.push({accessId : doc[i]._id, whitelist : doc[i].whitelist});
                        if(doc[i].ruleType === "rule"){
                            rule.push({rule : doc[i].rule, whitelist : doc[i].whitelist});
                            let d = await ac.Rule.find({rule : doc[i].rule});
                            if (d.length){
                                for(let j = 0, length =d.length; j < length; j++ ){
                                    if(d[j].ruleGroup !== ""){
                                        ruleGroup.push({rule : d[j].rule, whitelist : doc[i].whitelist});
                                    }
                                }
                            }
                        }else
                            ruleGroup.push({rule : doc[i].rule, whitelist : doc[i].whitelist});
                    }
                }

                //step 8, 9
                resource = [], resourceGroup =[];
                for(let i = 0, length = rule.length; i < length; i++){
                    let doc= await ac.RuleProRes.find({rule : rule[i].rule, ruleType : "rule"});
                    if(doc[0] && doc[0].proResType === "resource"){
                        resource.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : rule[i].whitelist });
                    }else if(doc[0] && doc[0].proResType === "resourcegroup")
                        resourceGroup.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : rule[i].whitelist });

                }

                for(let i = 0, length = ruleGroup.length; i < length; i++){
                    let doc= await ac.RuleProRes.find({rule : ruleGroup[i].rule, ruleType : "rulegroup"});
                    if(doc[0] && doc[0].proResType === "resource"){
                        resource.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : ruleGroup[i].whitelist });
                    }else if(doc[0] && doc[0].proResType === "resourcegroup")
                        resourceGroup.push({proRes : doc[0].proRes, operation : doc[0].operation, whitelist : ruleGroup[i].whitelist });

                }

                for(let i = 0, length =resourceGroup.length; i < length; i++){
                    let doc = await ac.Resource.find({resourceGroup : resourceGroup[i].proRes});
                    for(let j=0, length = doc.length; j < length; j++){
                        resource.push({proRes : doc[j].resource, operation : resourceGroup[i].operation, whitelist : resourceGroup[i].whitelist });
                    }
                }

                for(let i = 0, length =resource.length; i < length; i++){
                    let doc = await ac.Resource.find({resource : resource[i].proRes});
                    if(doc.length) {
                        resource[i]["container"] = doc.container;
                        resource[i]["resourceKind"] = doc.resourceKind;
                    }
                }
                state = "ok";
                result = resource;


            }else{
                state = "error";
                result = "用户名不存在!";
            }

            return {state: state, result: result};
        },
    accessRefine : async function(mainResPro, user, userType){
        console.log("accessRefine");
        //1, check if mainResPro is accessible
        //2, check if other resPro are accessible
        //{proRes : resource, operation : operation, whitelist : whitelist, container : container }
        let doc = await module.exports.checkAccess(user, userType);

        if(doc.state == "ok") {
            let access = doc.result;
            let result = {mainResPro: true}, proResList = {};

            function chkAccess(proRes, access) {
                for (let i = 0, length = access.length; i < length; i++) {
                    if (access[i].proRes === proRes) {
                        if (access[i].operation == 0)
                            return false;
                        else if (access[i].container)
                            return chkAccess(access[i].container, access);
                        else
                            return true;
                    }

                }
                //
                return true;
            }

            //step 1
/*            for (let i = 0, length = access.length; i < length; i++) {
                if (access[i].proRes === url) {
                    // if(access[i].whitelist === "whitelist" && access[i].operation){
                    if (!access[i].operation) {
                        result.mainResPro = false;
                    }
                }
            }*/

            result.mainResPro = chkAccess(mainResPro, access);

            if (result.mainResPro) {
                result.proRes = [];

                for (let i = 0, length = access.length; i < length; i++) {
                    if (access[i].proRes === mainResPro) continue;
                    let operation = chkAccess(access[i].proRes, access);
                    result.proRes.push({
                        proRes: access[i].proRes
                        , operation: operation
                        , resourceKind: access[i].proRes.resourceKind
                    });
                    proResList[access[i].proRes.split("?id=")[1]] = operation;
                }
            }

            return {result, proResList};
        }else
            return {result : {mainResPro : false}}

},
    operatorInfo : function(req,res) {
        console.log("/admin/operatorInfo");
        let access;
        //1、to check session
        //2、to check the access permission
        //3、to render the page according the permission

        if (req.session.operator) {
            //2、to check the access permission
            (async function () {
                    access = await module.exports.accessRefine("/admin/p_operatorinfo", req.session.operator, "operator");
                    console.log(access);
                    if (access.result.mainResPro){
                        access.proResList.urlpath = req.baseUrl + req.path;
                        access.proResList.operator = req.session.operator;
                        access.proResList.lastVisitTime = new Date(req.session.lastVisitTime).toLocaleString();
                        res.set("Content-Type", "text/html");
                        res.render("frame.ejs",access.proResList);
                    }else{
                        res.set("Content-Type", "text/html");
                        res.send('page access denied!');
                    }
                }
            )();

        } else
            {res.set("Content-Type","text/html");
            res.send("login, pls!");}

    },
    modifyPwd : function (req, res) {
        console.log("/admin/modifypwd");
        console.log(req.body);
        if (req.session.operator) {
            let result = {};
            (async function () {
                let oldpwdEnCrypto = funcs.enCrypto(req.body.oldpwd);
                let doc = await ac.Operator.find({operator: req.session.operator, password: oldpwdEnCrypto});
                if (doc.length != 0) {
                    let newpwdEnCrypto = funcs.enCrypto(req.body.newpwd);
                    doc = await ac.Operator.update({operator: req.session.operator}, {password: newpwdEnCrypto});
                    if (doc.nModified != 0) {
                        result.state = "ok";
                        result.result = "password modified!";
                    } else {
                        result.state = "error";
                        result.result = "modification failed!";
                    }
                } else {
                    result.state = "error";
                    result.result = "old password is wrong!";
                }
                res.set("Content-Type", "application/json");
                res.send(result);
            })();
        } else {
            res.set("Content-Type", "text/html");
            res.send("login, pls!");
        }
    },
    userCrud : function (req, res){
        console.log("/admin/userCrud");
        //1、to check session
        //2、to check the access permission
        //3、to render the page according the permission
        if (req.session.operator) {
            (async function () {
                access = await module.exports.accessRefine("/admin/usercrud", req.session.operator, "operator");
                console.log(access);
                if (access.result.mainResPro) {
                    switch (req.method) {
                        case "GET" :
                            console.log("/admin/userCrud/GET");
                            console.log(req.query);

                            (async function () {
                                let doc = await userUser.find(req.query);

                                res.set("Content-Type", "application/json");
                                res.send(doc);
                            })();
                            break;
                        case "PUT" :
                            console.log("/admin/userCrud/PUT");
                            let form = new formidable.IncomingForm();
                            form.uploadDir = "./tmp";
                            form.keepExtensions = true;

                            co(function* () {
                                let result = yield function (cb) {
                                    form.parse(req, cb);
                                }
                                console.log(result);
                                let update = {};
                                //same code as in user_controller.js->p_updateUserInfo
                                //更新avator
                                if (result[1].hasOwnProperty("avator") && result[1].avator.name.length > 0) {
                                    //查询原来的avator文件名
                                    let doc = yield function (cb) {
                                        userUser.toFind({username: result[0].username}, cb)
                                    };
                                    //删除原来的avator
                                    yield function (cb) {
                                        fs.unlink("./data/users/" + result[0].username + "/" + doc.avator, cb);
                                    }
                                    //把新avator移动到用户目录
                                    let avator = result[0].username + "_avator." + result[1].avator.path.split(".")[1];
                                    yield function (cb) {
                                        let avatorPath = "./data/users/" + result[0].username + "/" + avator;
                                        fs.rename(result[1].avator.path, avatorPath, cb);
                                    }
                                    update.avator = avator;
                                }

                                if (JSON.stringify(result[0]) != "{}") {
                                    //更新各个注册字段
                                    if (result[0].password) update.password = funcs.enCrypto(result[0].password);
                                    if (result[0].name) update.name = result[0].name;
                                    if (result[0].email) update.email = result[0].email;
                                    if (result[0].phone) update.phone = result[0].phone;
                                }

                                if (JSON.stringify(update) != "{}") {
                                    let doc = yield function (cb) {
                                        userUser.toUpdate({username: result[0].username}, update, cb);
                                    }
                                    if (doc.nModified) {
                                        res.set("ContentType", "applications/json");
                                        res.send({state: "ok", result: update});
                                    }else{
                                        res.set("ContentType", "applications/json");
                                        res.send({state: "error", result: update});
                                    }
                                }else{
                                    res.set("ContentType", "applications/json");
                                    res.send({state: "ok", result: update});
                                }
                            });
                            break;
                        case "DELETE" :
                            console.log("/admin/userCrud/DELETE");
                            console.log(req.body);
                            (async function(){
                                let result = await userUser.deleteOne({_id : req.body._id});
                                funcs.
                                console.log("result:",result);
                                if(result.ok == 1){
                                    res.set("Content-Type", "text/html");
                                    res.send("ok");
                                }else{
                                    res.set("Content-Type", "text/html");
                                    res.send("删除出错，请重试！");
                                }
                            })();
                            break;
                    }
                }
            })();
        } else
        {res.set("Content-Type","text/html");
            res.send("login, pls!");}
    },
    showImage : function(req,res){
        console.log("/admin/showImage");
        //1、to check session
        //2、to check the access permission
        //3、to render the page according the permission

        //1、to check session
        if (req.session.operator) {
            (async function () {
                    //2、to check the access permission
                    access = await module.exports.accessRefine("/admin/image", req.session.operator, "operator");
                    console.log(access);
                    if (access.result.mainResPro){
                        let readFile = util.promisify(fs.readFile);
                        let img = await readFile("./data/users/" + req.params.dir + "/" + req.params.filename);
                        res.set("Content-Type", "application/x-img");
                        res.send(img);
                    }else{
                        redirect("/img/avator.jpg");
                    }
                }
            )();

        } else
        {res.set("Content-Type","text/html");
            res.send("login, pls!");}

    }
}
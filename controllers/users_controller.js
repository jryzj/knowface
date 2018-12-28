/* Practice by JERRY, created on 2018/7/24*/
const dao = require("../models/mongooseDao");
const fs = require("fs");
const formidable = require("formidable");
const async = require("async");
const funcs = require("../lib/funcs");
const gm = require("gm");
const globalData = require("../models/global_data");
const co = require("co");


const userDoc = dao.Doc;
const userUser = dao.User;
const userPhoto = dao.Photo;
const userGlobal = dao.Global;
const userMessage = dao.Message;

const baiduClient = require("../lib/baiduFaceApi").Client;


module.exports = {
    p_userHome : function(req, res){
        console.log("p_userHome");
        console.log(req.session.visitorId);
        let username = req.session.username;
        let docs = [{"img":"/img/b.jpg","name":"test","id":"id123456","appearance":"ijaer;ofijes;rojgsroijgsojboij"}];
        if (username){
            // req.session.username = username; //更新session的时效，express-session默认每次res.send都会重写时效
            console.log(username);
            res.set("Content-Type","text/html");
            console.log(req.baseUrl,req.path);
            res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                "username":username,
            "docs": docs});
        }else
        res.redirect("/");
    },
    p_userDocs : function (req, res) {
        console.log("p_userDocs");
        let username = req.session.username;
        let docs = [{"img":"/img/b.jpg","name":"test","id":"id123456","appearance":"ijaer;ofijes;rojgsroijgsojboij"}];
        if (username){
            console.log(username);
            userDoc.toFindAll({"username" : username, "isDeleted" : "false", "isClosed" : "false"}, function(err, docs){
                if (err) handleError(err);
                console.log(docs);
                let docqty=0, matchqty=0, msgqty=0;
                let docdata = [];
                for (let doc of docs) {
                    let tempdoc = {};
                    console.log(doc.photos);
                    // tempdoc.img = (JSON.stringify(doc.photos) !== "[]") ? doc.photoDir + "/" + doc.photos[0] : "" ;
                    tempdoc.img = "/user/image/" + doc.photoDir.split("./data/users/")[1] + "/" + doc.photos[0];
                    tempdoc.name =  doc.name || "";
                    tempdoc.docname =  doc.docname;
                    tempdoc.appearance = doc.appearance || "";
                    docdata.push(tempdoc);
                }

                co(function* (){
                    let docs;
                    docs = yield function(cb){
                        userDoc.toFindAll({username : username}, cb);
                    }
                    docqty = docs.length;
                    for (let i = 0; i <docqty; i++){
                        if(docs[0]["matchedId"].length>0){
                            matchqty++;
                        }
                    }

                    docs = yield function(cb){
                        userMessage.toFindAll({receiver : username},cb);
                    }
                    msgqty = docs.length;

                    res.set("Content-Type","text/html");
                    res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                        "username":username,
                        "docs": docdata,
                        "docqty" : docqty,
                        "matchqty" : matchqty,
                        "msgqty" : msgqty});
                });

            });

        }else
            res.redirect("/");
    },
    p_createDoc : function (req, res) {
        console.log("p_createDoc");
        let username = req.session.username;
        if (username){
            console.log(username);
            let userdocid ="";
            console.log("userdocid:",req.session.userdocid);
            if (!req.session.userdocid){
                userdocid = username + "-" + Number(new Date());
                req.session.userdocid = userdocid;
            }else
            {
                userdocid = req.session.userdocid;
            }
            res.set("Content-Type","text/html");
            res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                "username" : username,
                "userdocid" : userdocid});
        }else
            res.redirect("/");
    },
    p_createDoc_save : function (req, res){
        console.log("p_createDoc_save");
        let username = req.session.username;
        if (username){
            let form = new formidable.IncomingForm();
            // let postfiles = [];
            // let postfields = [];

            form.uploadDir = "./tmp";
            form.keepExtensions = "true";
            form.multiples = "true";

            form.parse(req, function(err, fields, files){
                if (err) throw err;
                console.log(fields);
                console.log(files);

                //递归加回调的写法
                //创建档案目录
                let docdir = "./data/users/" + username + "/" + fields.userdocid;
                fs.mkdir(docdir, function (err) {
                    // if (err) throw err;
                    if (err) {
                        res.send("error");
                        throw err;
                    }
                    let filelist = [], filenamelist=[];

                    //复制一个文件列表
                    for (let file in files){
                        filelist.push(files[file]);
                    }
                    console.log("filelist", filelist);

                    //定义批量移动并从命名文件的递归函数
                    function movefiles (filelist, callback) {
                        if (filelist.length !== 0) {
                            let file = filelist.pop();
                            console.log("file", file);
                            let filename = file.path.split("upload_")[1];
                            filenamelist.push(filename);
                            fs.rename(file.path, docdir + "/" + filename, function (err) {
                                if (err) throw err;
                                movefiles(filelist, callback);
                            })
                        } else
                        {
                            callback();
                        }
                    }

                    //调用移动文件的递归函数，把写数据的操作放到回调函数里
                    movefiles(filelist,function(){
                        //进行数据库操作
                        let doc = {
                            docname : fields.userdocid,
                            username : username,
                            name : fields.name,
                            appearance : fields.appearance,
                            lostLocation : fields.location,
                            lostDate : fields.date,
                            description : fields.description,
                            photoDir : docdir,
                            photos : filenamelist,
                            matchDir : "",
                            matchedQty : 0,
                            matchedId : [],
                            isClosed : false,
                            isDeleted : false
                        };

                        //在数据库创建记录，把数据写入
                        //在doc表中增肌一条记录
                        userDoc.toCreate(doc, function (err, doc) {
                            if (err) throw err;
                            //在user表中，增加doc的path
                            userUser.toUpdate({"username" : username}, {"$addToSet": {"docIds" : fields.userdocid}}, function (err, raw) {
                                if (err) handleError(err);
                                console.log("raw", raw);
                                let photos = [];
                                for (let i = 0, length = filenamelist.length; i < length; i++) {
                                    photos.push({"photoPath" : docdir + "/" + filenamelist[i], "username" : username, "docname" : fields.userdocid});
                                }
                                //photo表中增加照片记录
                                userPhoto.toInsertMany(photos, function (err, docs ) {
                                    if (err) handleError(err);
                                    console.log(docs);
                                    //更新global中的统计数据
                                    userGlobal.toFindOneAndUpdate({},{$inc : {docQty : 1, photoQty : filenamelist.length }},function(err, docs){
                                            if (err) throw err
                                        else
                                            globalData.photoQty = raw.photoQty;
                                    });
                                    //异步执行人脸识别
                                    module.exports.detectFaceByDocname(fields.userdocid);
                                    module.exports.detectFaceWithoutToken();
                                    delete req.session.userdocid;
                                    res.send("ok");


                                })

                            });
                        })
                    })
                });
            });
        }else{
            console.log("redirect to /");
            res.send("redirect");
        }
    },
    p_createDoc_exit : function (req, res) {
        let username = req.session.username;
        if (username){
            console.log("p_createDoc_exit");
            delete req.session.userdocid;
            res.send("ok");
        }else
            res.send("error");
    },
    p_readDoc : function (req, res){
        console.log("p_readdoc");
        let username = req.session.username;
        if(username){
            console.log(req.body);
            console.log(req.params);
            console.log(req.query);
            let docname = req.query.docname;

            userDoc.toFind({"docname" : docname}, function (err, doc) {
                if (err) throw err;
                if (doc != null) {
                    let photourls = [];
                    for (let i = 0, length = doc.photos.length; i < length; i++) {
                        photourls[i] = "/user/image/" + username + "/" + doc.docname + "/" + doc.photos[i];
                    }
                    res.set("Content-Type", "text/html");
                    res.render("frame.ejs", {
                        "urlpath": req.baseUrl + req.path,
                        "username": username,
                        "docname": doc.docname,
                        "name": doc.name,
                        "location": doc.lostLocation,
                        "date": doc.lostDate,
                        "appearance": doc.appearance,
                        "description": doc.description,
                        "photourls": photourls
                    })
                }
            })

        }else{
            res.redirect("/");
        }
    },
    p_readDoc_faceFrame : function (req, res) {
        console.log("readdoc_faceFrame");
        let photoPath = "./data/users" + req.query.photoUrl.split("image")[1];
        userPhoto.toFind({photoPath : photoPath}, function(err, doc){
            res.send(JSON.stringify(doc["faceLocation"]));
        })

    },
    p_updateDoc : function (req, res) {
        console.log("p_updateDoc");

        let username = req.session.username;
        let docname = req.query.docname;

        if (username && docname) {
            userDoc.toFind({"docname" : docname}, function(err, doc){
                if (err) throw err;
                if (doc != null){
                    let photourls = [];
                    for (let i = 0, length = doc.photos.length; i < length ; i++){
                        // photourls[i] = "/user/image/" + username + "/" + doc.docname + "/" doc.photos[i];
                        photourls[i] = `/user/image/${username}/${doc.docname}/${doc.photos[i]}`;
                    }
                    res.set("ContentType", "text/html");
                    res.render("frame.ejs", {
                        "urlpath" : req.baseUrl + req.path,
                        "username" : username,
                        "docname" : doc.docname,
                        "name" : doc.name,
                        "location" : doc.lostLocation,
                        "date" : doc.lostDate,
                        "appearance" : doc.appearance,
                        "description" : doc.description,
                        "photourls" : photourls
                    })
                }
            })
        }else{
            res.redirect("/user/p_userdocs");
        }

    },
    p_updateDoc_exit : function (req, res) {
        let username = req.session.username;
        if (username){
            console.log("p_updateDoc_exit");
            delete req.session.userdocid;
            res.send("ok");
        }else
            res.send("error");
    },
    p_updateDoc_save: function (req, res) {
        console.log("p_updateDoc_save");
        let username = req.session.username;
        let form = new formidable.IncomingForm();
        form.uploadDir = "./tmp";
        form.keepExtensions = "true";
        form.multiples = "true";

        if (username) {
            form.parse(req, function (err, fields, files) {
                let photoFilelist = [];
                let photoNameList = [];
                let docdir = "./data/users/" + username + "/" + fields.userdocid + "/";
                let removedfilelist = fields.removedfilelist;
                if (removedfilelist.length>0) {
                    removedfilelist = removedfilelist.replace(/\/image/g, "").replace(/user/g, "users");
                    removedfilelist = removedfilelist.split(",");
                }
                if (err) throw err;
                async.series([
                    //删除原来photos、doc表里的，现在要删掉的照片
                    function (callback) {
                        let removedFilelist = [];
                        for (let i = 0, length = removedfilelist.length; i < length; i++) {
                            removedFilelist[i] = "./data" + removedfilelist[i];
                        }
                        if (removedFilelist.length > 0) {
                            module.exports.removePhotoFrDb(removedFilelist, function (err) {
                                callback(err);
                            })
                        } else
                            callback(null);
                    },
                    //删除原来硬盘里的，现在要删掉的照片
                    function (callback) {
                        let removedFilelist = [];
                        for (let i = 0, length = removedfilelist.length; i < length; i++) {
                            removedFilelist[i] = "./data" + removedfilelist[i];
                        }
                        if (removedFilelist.length > 0) {
                            if (funcs.removePathSync(removedFilelist))
                                callback(null);
                            else
                                callback('error');
                        } else
                            callback(null);
                    },
                    //重命名并移动新的照片到档案目录
                    function (callback) {
                        async.each(files, function (file, callback) {
                            let filename = file.path.split("upload_")[1];
                            let newpath = docdir + filename;
                            fs.rename(file.path, newpath, function (err) {
                                if (err)
                                    callback(err);
                                else {
                                    photoFilelist.push(newpath);
                                    photoNameList.push(filename);
                                    callback(err);
                                }
                            })
                        }, function (err) {
                            callback(err)
                        })
                    },
                    //更新数据库操作
                    function (callback) {
                        //更新photos表
                        async.eachSeries(photoFilelist, function (photofile) {
                            let doc = {
                                "photoPath": photofile,
                                "username": username,
                                "docname": fields.userdocid
                            }
                            userPhoto.toCreate(doc, function (err, doc) {
                                callback(err);
                            })
                        }, function (err) {
                            callback(err);
                        });
                    },
                    //更新doc表
                    function (callback) {
                        let doc = {
                            "name": fields.name,
                            "lostLocation": fields.location,
                            "lostDate": fields.date,
                            "appearance": fields.appearance,
                            "description": fields.description
                        };
                        async.series([
                            function (callback) {
                                userDoc.toUpdate({"docname": fields.userdocid}, {$set: doc}, function (err, raw) {
                                    callback(err);
                                });
                            },
                            function (callback) {
                                 userDoc.toUpdate({"docname": fields.userdocid}, {$addToSet: {"photos": photoNameList}}, function (err, raw) {
                                     callback(err);
                                });
                            }
                        ], function (err) {
                            callback(err);
                        })
                    },
                    //更新global表
                    function (callback){
                        userGlobal.toFindOneAndUpdate({}, {$inc : {photoQty :(photoFilelist.length - removedfilelist.length)}}, function(err, raw){
                            if (err)
                                callback(err);
                            else
                                globalData.photoQty = raw.photoQty;
                            callback(err);
                        });
                    }
                ], function (err) {
                    if (err) throw err;
                    res.send("ok");
                    module.exports.detectFaceByDocname(fields.userdocid);
                    module.exports.detectFaceWithoutToken();
                });
            });
        } else {
            res.send("redirect");
        }
    },
    p_userDocs_deleteDoc : function(req, res){
        console.log("p_userDocs_deleteDoc");
        let username = req.session.username;
        console.log(req.body);
        let doclist = req.body["doclist"];

        if (username && doclist.length){
            async.parallel([
                function(callback){
                    console.log("根据档案号在doc表里找到档案删除");
                    userDoc.toRemoveAll({"docname" : doclist}, function (err) {
                        callback(err,null);
                    })
                },
                function(callback){
                    console.log("把用户表里档案数组进行修改，删除档案编号");
                    userUser.toFind({"username" : username}, function (err, docs) {
                        if (err) callback(err, null);
                        let docIds = docs["docIds"];
                        for (let docid of doclist){
                            docIds.splice(docIds.indexOf(docid),1);
                        }
                        userUser.toUpdate({"username" : username}, {$set : {"docIds" : docIds}}, function(err, docs){
                            callback (err, docs);
                            })
                    })
                },
                function(callback){
                    console.log("把photos表里的数据删除");
                    userPhoto.toRemoveAll({"docname" : doclist},function(err, docs){
                        callback (err, docs);
                    })
                },
                function(callback){
                    console.log("删除档案目录");
                    let docdir = doclist.slice(0);
                    for (let i = 0, length = docdir.length; i < length; i++){
                        docdir[i] = "./data/users/" + username + "/" + docdir[i];
                    }
                    funcs.removePathSync(docdir);
                    callback(null, "删除档案目录成功");
                }
            ],function (err,result) {
                if (err) throw err;
                console.log(result);
                res.send("ok");
            })
        }else
            res.send("error");
    },
    p_userMsg_old : function (req, res) {
        console.log("p_userMsg");
        let username = req.session.username;
        if(username){
            let page = 0, qty = 10, textLength = 30;
            let msgs;
            co(function* (){
                msgs = yield function(cb){
                    module.exports.p_userMsg_getMsgs({receiver: username}, qty, page*10, cb);
                }
                for (let i = 0, len = msgs.length;  i < len; i++){
                    let content = msgs[i].content;
                    content = content.replace(/(\n)/g, "");
                    content = content.replace(/(\t)/g, "");
                    content = content.replace(/(\r)/g, "");
                    content = content.replace(/<\/?[^>]*>/g, "");
                    content = content.replace(/\s*/g, "");
                    if (content.length > textLength){
                        content = content.slice(30) +"...";
                    }
                    msgs[i].content = content;
                }

                res.set("Content-Type","text/html");
                res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                    "username":username,
                    "messages": msgs});

            }).catch(function (err){
                if (err) throw err;
            });


        }else{
            res.redirect("/");
        }

    },
    p_userMsg : function(req, res){
        console.log("p_userMsg");
        let username = req.session.username;
        if(username){
            res.set("Content-Type","text/html");
            res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                "username":username});

        }else{
            res.redirect("/");
        }

    },
    userMsgCrud : function(req, res){
        console.log("p_userMsgCrud");
        let username = req.session.username;
        if(username){
            switch (req.method){
                case "GET" :
                    (async function(){
                        console.log("p_userMsgCrud_get");

                        let doc =await userMessage.toFindAll(req.query);
                        res.set("Content-Type", "application/json");
                        res.send(doc);
                    })();
                    break;
                case "PUT" :
                    (async function(){
                        console.log("p_userMsgCrud_put");
                        console.log(req.body);
                        try {
                            let doc =await userMessage.toUpdate({_id : req.body._id}, {isRead : true});
                            console.log(doc);
                            if (doc.nModified){
                                res.set("Content-Type", "application/json");
                                res.send({state : "ok", result : req.body});
                            }else{
                                res.set("Content-Type", "application/json");
                                res.send({state : "error", result : "修改出错！"});
                            }
                        } catch (e) {
                            console.log(e);
                            res.set("Content-Type", "application/json");
                            res.send({state : "error", result : e});
                        }

                    })();
                    break;
                case "DELETE" :
                    (async function(){
                        console.log("p_userMsgCrud_delete");
                        console.log(req.body);
                        try {
                            let doc =await userMessage.toRemove({_id : req.body._id});
                            console.log(doc);
                            if (doc.nModified){
                                res.set("Content-Type", "application/json");
                                res.send({state : "ok", result : ""});
                            }else{
                                res.set("Content-Type", "application/json");
                                res.send({state : "error", result : "修改出错！"});
                            }
                        } catch (e) {
                            console.log(e);
                            res.set("Content-Type", "application/json");
                            res.send({state : "error", result : e});
                        }

                    })();
                    break;


            }

        }else{
            res.redirect("/");
        }

    },
    p_userMsg_getMsgs : function(condition, qty, skip, callback){
                userMessage.toFindWithArgs(condition,"_id sender receiver content sendDate isRead", {skip : skip, limit : qty }, function(err, docs){
                    callback(err,docs);
        })
    },
    p_userMsg_getMsg : function(req, res){
        console.log("p_userMsg_getMsg");
        let username = req.session.username;
        if(username){
            co(function* (){
                let msg = yield function(cb){
                    module.exports.p_userMsg_getMsgs({_id : req.params.id}, 1, 0, cb);
                }
                res.send(msg[0]);
            }).catch(function (err){
                if (err) throw err;
            });
        }else{
            res.redirect("/");
        }
    },
    p_userInfo : function (req, res) {
        console.log("p_userInfo");
        let username = req.session.username;
        if(username){
            co(function *(){
                let doc = yield function(cb){
                    userUser.toFind({username:username}, cb);
                }
                res.set("Content-Type","text/html");
                res.render("frame.ejs",{"urlpath": req.baseUrl + req.path,
                    "username":username,
                    "realname" : doc.name,
                    "email" : doc.email,
                    "phone" : doc.phone,
                    'avator' : "/user/image/" + username + "/" + doc.avator});
            }).catch(function(err){
                if (err) throw err;
            });


        }else{
            res.redirect("/");
        }
    },
    p_updateUserInfo : function (req, res) {
        console.log("p_updateUserInfo");
        let username = req.session.username;
        if(username){
            co(function *() {
                let update = {};
                let form = new formidable.IncomingForm();
                form.uploadDir = "./tmp";
                form.keepExtensions = true;
                let result = yield function (cb) { //reslut[0]是fields, reslut[1]是files
                    form.parse(req, cb);
                };
                console.log(result);
                //更新avator
                if (result[1].hasOwnProperty("avator")) {
                    //查询原来的avator文件名
                    let doc = yield function (cb) {
                        userUser.toFind({username: username}, cb)
                    };
                    //删除原来的avator
                    yield function (cb) {
                        fs.unlink("./data/users/" + username + "/" + doc.avator, cb);
                    }
                    //把新avator移动到用户目录
                    let avator =  username + "_avator." + result[1].avator.path.split(".")[1];
                    yield function (cb) {
                        let avatorPath =  "./data/users/" + username + "/" + avator;
                        fs.rename(result[1].avator.path, avatorPath, cb);
                    }
                    update.avator = avator;
                }

                if (JSON.stringify(result[0]) != "{}") {
                //更新各个注册字段
                    if (result[0].password) update.password = funcs.enCrypto(result[0].password);
                    if (result[0].realname) update.name = result[0].realname;
                    if (result[0].email) update.email = result[0].email;
                    if (result[0].phone) update.phone = result[0].phone;
                    }

                if(JSON.stringify(update) != "{}") {
                    yield function (cb) {
                        userUser.toUpdate({username: username}, update, cb);
                    }
                }

                res.send("用户信息更新成功！")
            }).catch(function(err){
                res.send("修改出现错误，请重试！");
                if (err) throw err;
            });


        }else{
            res.redirect("/");
        }


    },
    p_logout : function (req, res) {
        console.log("p_logout");
        req.session.destroy(function (err) {
            if(err) throw err;
        });
        res.redirect("/");
    },
    showImg : function (req, res) {
        console.log("/user/img");
        let username = req.session.username;
        if (username){
            if (username === req.params.username) {
                let imgFile = "./data/users/" + req.params.username;
                if (req.params.dir) imgFile = imgFile + "/" + req.params.dir;
                if (req.params.filename) imgFile = imgFile + "/" + req.params.filename;
                fs.readFile(imgFile, function (err, data) {
                    res.set("ContentType", "image/jpeg");
                    res.send(data);
                })
            }
        }else
            res.redirect("/");
    },
    //从数据库和硬盘上移除照片
    removePhotoFrDb: function (photolist,callback) {
        //以照片为主控因素，来操作数据更改
        //photolist 是图片绝对路径的数组， 属于同一个用户
        //更新photos, docs数据表和硬盘删除

        async.eachSeries(photolist, function (photofile, callback) {
            let photoPath = photofile.split("/");
            let docname = photoPath[4];
            let photoname = photoPath[5];
            async.parallel([
                    function (callback) {
                        //操作photos表
                        userPhoto.toRemove({"photoPath": photofile}, function (err, doc) {
                            console.log(`userPhoto.toRemove({"photoPath": photofile}, function (err, doc)>>>`,doc);
                            callback(err);
                        })
                    },
                    function (callback) {
                        //操作docs表
                        userDoc.toFind({"docname": docname}, function (err, docs) {
                            if (JSON.stringify(docs) !== {} && docs.photos.length > 0) {
                                console.log("docs.photos",docs.photos);
                                console.log("photoname", photoname);
                                docs.photos.splice(docs.photos.indexOf(photoname), 1);
                                console.log("docs.photos 1 ",docs.photos);
                                userDoc.toUpdate({"docname": docname}, {$set: {"photos": docs.photos}}, function (err, raw) {
                                    console.log(`userDoc.toUpdate({"docname": docname}, {$set: {"photos": photos}}`, raw);
                                    callback(err);
                                })
                        }
                        })
                    }],
                function (err) {
                    callback(err);
                })
        }, function (err) {
            callback(err);
        });
    },
    addPhotoToDb : function(photolist, docdir, username){

    },
    removeDoc : function(){

    },
    removeUser : function(){

    },
    detectFaceByDocname : function(docname){
        console.log("detectFaceByDocname");
        //查询photos表中docname中图片，且face_token是空的图片

         userPhoto.toFindAll({"docname" :  docname, "faceToken" : {"$in" : ["", null]}}, function (err, docs) {
            if (err) throw err;
            for (let i = 0, length = docs.length; i < length; i++){
                fs.readFile(docs[i].photoPath, function (err, data) {
                    if (err) throw err;
                    baiduClient.detect(data.toString("base64"), "BASE64").then(function(result) {
                        console.log(JSON.stringify(result));
                        // {"error_code":0,"error_msg":"SUCCESS","log_id":6584551555999,"timestamp":1536041927,"cached":0,"result":{"face_num":1,"face_list":[{"face_token":"75eaa2bb1b5dbf2fc0bbf4be10e19be6","location":{"left":51.76753235,"top":76.86214447,"width":89,"height":80,"rotation":-1},"face_probability":1,"angle":{"yaw":-5.480030537,"pitch":9.606204987,"roll":-1.659206033}}]}}
                        // {"error_code":222202,"error_msg":"pic not has face","log_id":2579559900105,"timestamp":1536041927,"cached":0,"result":null}
                        if (result.error_msg === "SUCCESS") {
                            gm(docs[i].photoPath).size(function(err, size){
                                if (err) throw err;
                                let location = result["result"].face_list[0].location;
                                docs[i].faceLocation =[location.left,location.top,location.width,location.height, size.width, size.height];
                                docs[i].faceToken = result["result"].face_list[0].face_token;
                                userPhoto.toUpdate({"photoPath" : docs[i].photoPath}, docs[i], function(err, raw){
                                    if (err) throw err;
                                })
                            })

                        }
                        else {
                            docs[i].faceToken = result.error_msg;
                            userPhoto.toUpdate({"photoPath" : docs[i].photoPath}, docs[i], function(err, raw){
                                if (err) throw err;
                            })
                        }
                    }).catch(function(err) {
                        // 如果发生网络错误
                        console.log(err);
                    });
                })
            }
        })
    },
    detectFaceWithoutToken : function () {
        console.log("detectFaceWithoutToken");
        userPhoto.toFindAll({"faceToken" : {"$in" : ["", null]}}, function (err, docs) {
            if (err) throw err;
            for (let i = 0, length = docs.length; i < length; i++){
                fs.readFile(docs[i].photoPath, function (err, data) {
                    if (err) throw err;
                    baiduClient.detect(data.toString("base64"), "BASE64").then(function(result) {
                        console.log(JSON.stringify(result));
                        if (result.error_msg === "SUCCESS") {
                            gm(docs[i].photoPath).size(function(err, size){
                                if (err) throw err;
                                let location = result["result"].face_list[0].location;
                                docs[i].faceLocation =[location.left,location.top,location.width,location.height, size.width, size.height];
                                docs[i].faceToken = result["result"].face_list[0].face_token;
                                userPhoto.toUpdate({"photoPath" : docs[i].photoPath}, docs[i], function(err, raw){
                                    if (err) throw err;
                                })
                            })
                        }
                        else {
                            docs[i].faceToken = result.error_msg;
                            userPhoto.toUpdate({"photoPath" : docs[i].photoPath}, docs[i], function(err, raw){
                                if (err) throw err;
                            })
                        }
                    }).catch(function(err) {
                        // 如果发生网络错误
                        console.log(err);
                    });
                })
            }
        })

    }

}
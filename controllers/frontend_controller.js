/* Practice by JERRY, created on 2018/7/23*/
const dao = require("../models/mongooseDao");
const fs = require("fs");
const formidable = require("formidable");
const util = require("util");
const gm = require("gm");
const async = require("async");
const co = require("co");
const globalData = require("../models/global_data");
const funcs = require("../lib/funcs");

const userUser = dao.User;
const userToMatch = dao.ToMatch;
const userPhoto = dao.Photo;
const userDoc = dao.Doc;
const userGlobal = dao.Global;
const userMessage = dao.Message;

const baiduClient = require("../lib/baiduFaceApi").Client;

module.exports = {
    showHome: function (req, res) {
        console.log("showhome");
        console.log(req.path);
        res.set("Content-Type", "text/html");
        console.log(req.session.username);
        res.render("frame.ejs", {
            "urlpath": req.baseUrl + req.path,
            "username": req.session.username
        });

    },
    homeDocs: function (req, res) {
        console.log("homeDcos");
        //随机推送一组档案数据到前台，包括1张主图和文字信息。


    },
    favicon: function (req, res) {
        res.set("Content-Type", "image/jpeg");
        fs.readFile("./public/img/favicon.ico", function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    },
    p_signup: function (req, res) {
        console.log("p_signup");
        console.log(req.path);
        res.set("Content-Type", "text/html");
        res.render("frame.ejs", {"urlpath": req.baseUrl + req.path});
    },
    p_signup_adduser: function (req, res) {
        console.log("p_signup_adduser");
        console.log(req.path);
        // console.log(req);
        let form = new formidable.IncomingForm();
        let postdata = {},
            postfile = {};
        form.uploadDir = "./tmp";
        form.keepExtensions = "true";

        form.on("error", function (err) {
            console.log(err);
        }).on('field', function (field, value) {
            console.log("form.field");
            console.log(field, value);
            if (form.type === "multipart") {
                if (field in postdata) {
                    if (util.isArray(postdata[field]) === false) {
                        postdata[field] = [postdata[field]];
                    }
                    postdata[field].push(value);
                    return;
                    /* 当form 有enctype=“multipart/form-data”  和没有 enctype=“multipart/form-data” 时 同名表单处理的方式不一样。

                    有 enctype=“multipart/form-data” 时 同名表单会被最后一个value覆盖，

                    没有 enctype="multipart/form-data"时，同get一样 会返回一个array

                    所以， 在 'field’事件时，对form.type进行不同处理 ， 同名表单都返回array*/
                }
            }
            postdata[field] = value;
        }).on("file", function (field, file) {
            console.log("form.file");
            postfile[field] = file;
        }).on("end", function () {
            console.log(form);
            console.log(postdata);
            console.log(postfile);
            //1、进行数据检查，（前端校验过了，是否可以不校验）
            //  *username是否重复，只能小写。
            //  *密码1是否够长
            //  *密码1、2是否一致
            //  *邮件地址格式是否合规
            //  *电话格式是否合规
            //  *头像大小是否合适，500x500
            //2、在./usrs目录下新建用户目录，把avatori移动到用户目录下面。
            console.log(__dirname);
            let dir = "./data/users/" + postdata.username;

            let filename;

            co(function* () {
                //2、建立用户目录
                yield function (cb) {
                    fs.mkdir(dir, cb);
                }
                //如果有avator文件，移动到用户目录，并重命名
                let orgPath, targetPath;
                if (postfile.filename.name.length != 0) {
                    filename = postdata.username + "_avator." + postfile.filename.path.split(".")[1];
                    orgPath = postfile.filename.path;
                    targetPath = dir + "/" + filename;
                    yield function (cb) {
                        fs.rename(orgPath, targetPath, cb);
                    }
                }else {
                    filename = postdata.username + "_avator.jpg";
                    orgPath = "./public/img/avator.jpg";
                    targetPath = dir + "/" + filename;
                    yield function (cb) {
                        fs.copyFile(orgPath, targetPath, cb);
                    }
                }



                //3、在数据库插入数据
                let newUser = {
                    username: postdata.username,
                    password: funcs.enCrypto(postdata.password1, postdata.username),
                    name: postdata.realname,
                    email: postdata.email,
                    phone: postdata.phone,
                    avator: filename,
                    userDir: dir,
                    createTime: Date.now(),
                    updateTime: Date.now(),
                    group: "user",
                    isDeleted: false,
                    docQty: 0,
                    docIds: [],
                    isLogin: false
                };
                let docs = yield function (cb) {
                    userUser.toCreate(newUser, cb);
                }
                console.log("toCreate,user doc is ", docs);
                yield function (cb) {
                    userGlobal.toFindOneAndUpdate({}, {$inc: {userQty: 1}}, cb);
                }

                //4、设置session
                //5、反馈到前端
                req.session.username = postdata.username;
                res.render("p_signup_result.ejs", {"result": true});


/*                console.log(__dirname);
                console.log(postfile.filename.path);
                console.log(file_ext);*/
            }).catch(function (err) {
                if (err) throw err;
            });

        });
        form.parse(req);
    },
    p_login: function (req, res) {
        console.log("p_login");
        res.set("Content-Type", "text/html");
        res.render("frame.ejs", {"urlpath": req.baseUrl + req.path});
    },
    p_login_login: function (req, res) {
        console.log("p_login_login");
        let result = false;
        let postdata = {};
        let form = new formidable.IncomingForm();
        form.on("error", function (err) {
            console.log(err);
        }).on("field", function (name, value) {
            console.log("on field");
            postdata[name] = value;
        }).on("end", function () {
            //数据库查询及比对
            console.log("postdata:", postdata);
            userUser.toFind({"username": postdata.p_login_input_username}, function (err, doc) {
                if (err) throw err;
                if (doc != null) {
                    console.log("find username doc done!");
                    console.log(doc);
                    if (doc.password === funcs.enCrypto(postdata.p_login_input_password, postdata.p_login_input_username)) {
                        console.log("密码一致");
                        //设置登录的session
                        req.session.username = postdata.p_login_input_username;
                        console.log(req.session);
                        result = true;
                    }
                }
                console.log("what.happen");
                res.send(result);
            });
        });
        form.parse(req);
    },
    p_matchDoc: function (req, res) {
        console.log("p_matchDoc");
        res.set("Content-Type", "text/html");
        res.render("frame.ejs", {"urlpath": req.baseUrl + req.path,
                                    "username" : req.session.username});
    },
    p_chkMatch: function (req, res) {
        console.log("p_chkMatch");

        //计算完成比例，
        let completion = 0;
        if (globalData.matchProgress[req.sessionID]) {
            if (globalData.matchProgress[req.sessionID][1] === "error") {
                //如果比对出错
                res.set("Content-Type", "text/html");
                res.render("frame.ejs", {
                    "urlpath": req.baseUrl + req.path,
                    "username": req.session.username,
                    "matchDone": 0,
                    "message": "比对错误，请重试！",
                    "data" : "notready"
                    //[{photoPath:imgurl, matchedPhoto :[imgurl , , ]},]
                });
            } else {
                completion = globalData.matchProgress[req.sessionID][1] / globalData.photoQty;
                if (completion * 100 > 99 && globalData.matchProgress[req.sessionID][3] == "finished") {
                    //如果比对完成
                    //汇总数据
                    userToMatch.toFindAll({visitorId:req.sessionID, isFinished: true}, function(err, docs){
                        let data=[];
                        for (let doc of docs){
                            let photos =[];
                            for (let m of doc.matchedPhoto){
/*                                for (let n of m){
                                    photos.push("/img/"+funcs.enCryptoDES(n[0], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv));
                                }*/
                                photos.push("/img/"+funcs.enCryptoDES(m[0], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv));
                            }
                            if(photos.length>0){
                                let d = {photoPath: "/img/"+funcs.enCryptoDES(doc.photoPath, globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)};//路径需要加密
                                d.matchedPhoto = photos;
                                data.push(d);
                            }
                        }
                        console.log("chkmatch===", data);
                        if(data.length==0) data="empty";
                        res.set("Content-Type", "text/html");
                        res.render("frame.ejs", {
                            "urlpath": req.baseUrl + req.path,
                            "username": req.session.username,
                            "matchDone": 100,
                            "message": "比对完成，结果如下！",
                            "data" : data  //[{photoPath:imgurl, matchedPhoto :[imgurl , , ]},]
                        });
                    });

                }
                else {
                    //如果比对没有完成
                    res.set("Content-Type", "text/html");
                    let message = `比对中，完成了 ${Math.floor(completion*100)}%，请稍候！`;
                    res.render("frame.ejs", {
                        "urlpath": req.baseUrl + req.path,
                        "username": req.session.username,
                        "matchDone": Math.floor(completion*100), //完成的比分比数
                        "message": message,
                        "data" : "notready"
                    });
                }
            }
        } else {
            res.set("Content-Type", "text/html");
            res.render("frame.ejs", {
                "urlpath": req.baseUrl + req.path,
                "username": req.session.username,
                "matchDone": completion*100, //完成的比分比数
                "message": "没有比对记录！",
                "data" : "notready"
            });
        }

        //清理已经过期sessionID,以免matchProgress不断的变大，已改到global_data.js中
       /* co(function *(){
            let session;
            for (let m in globalData.matchProgress){
                    session = yield function(cb){req.session.store.get(m,cb)};
                    if(!session){
                        delete globalData.matchProgress.m;
                    }
            }
        })*/


    },
    chkMatch : function (req, res){
        console.log("chkMatch");

        //计算完成比例，
        let completion = 0;
        if (globalData.matchProgress[req.sessionID]) {
            if (globalData.matchProgress[req.sessionID][1] === "error") {
                //如果比对出错
                res.set("Content-Type", "applications/json");
                res.send({state : "error", result : "比对错误，请重试！"});
            } else {
                completion = globalData.matchProgress[req.sessionID][1] / globalData.photoQty;
                if (completion * 100 > 99 && globalData.matchProgress[req.sessionID][3] == "finished") {
                    //如果比对完成
                    //汇总数据
                    co(function* () {
                        let data = [];
                        for (let i = 0, length = globalData.matchProgress[req.sessionID][2].length; i < length; i++) {
                            let docs = yield function (cb) {
                                userToMatch.toFindAll({
                                    _id: globalData.matchProgress[req.sessionID][2][i],
                                    isFinished: true
                                }, cb);
                            }

                            for (let doc of docs) {
                                let photos = [];
                                for (let m of doc.matchedPhoto) {
                                    photos.push("/img/" + funcs.enCryptoDES(m[0], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv));
                                }
                                if (photos.length > 0) {
                                    let d = {photoPath: "/img/" + funcs.enCryptoDES(doc.photoPath, globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)};//路径需要加密
                                    d.matchedPhoto = photos;
                                    data.push(d);
                                }
                            }
                        }

                        delete globalData.matchProgress[req.sessionID];
                        console.log("chkmatch===", data);
                        if (data.length == 0) data = "empty";
                        res.set("Content-Type", "text/html");
                        res.render("chkmatch.ejs", {
                            /*                            "urlpath": req.baseUrl + req.path,
                                                        "username": req.session.username,
                                                        "matchDone": 100,*/
                            "message": "比对完成，结果如下！",
                            "data": data  //[{photoPath:imgurl, matchedPhoto :[imgurl , , ]},]
                        });


                    });


                }
                else {
                    //如果比对没有完成
                    res.set("Content-Type", "applications/json");
                    res.send({state : "notready", result : Math.floor(completion*100) + "%"});
                }
            }
        } else {
            res.set("Content-Type", "applications/json");
            res.send({state : "error", result : "没有比对记录！"});
        }
    },
    p_matched: function (req, res) {
        console.log("p_matched");
    },
    p_docs: function (req, res) {
        console.log("p_docs");
    },
    randomDocs: function (req, res) {

    },
    p_userMsg: function (req, res) {
        console.log("p_userMsg");
        console.log(req.baseUrl, "===", req.path);
        res.set("Content-Type", "text/html");
        res.render("frame.ejs", {"urlpath": req.baseUrl + req.path});
    },
    p_matchDoc_toMatch: function (req, res) {
        console.log("p_matchDoc_toMatch");
        let username = req.session.username || "";

        /*        if (!req.session.visitorId) {
                    req.session.visitorId = Number(new Date());
                }*/
        let visitorId = req.sessionID;

        let faceInFiles = []; //[{"filePath" : file.path, faceInOneFile : [{facePath: xxx , faceToke : xxxx}, ]},  ]
        let matchedInPhotos = {}; //{"photoPath" : file.path, "matchedInOnePhoto" : [photo表里的photopath, facepath, score]}
        let filePathes = [];

        let form = new formidable.IncomingForm();
        form.uploadDir = "./tmp/tomatch/" + visitorId;
        form.keepExtensions = "true";
        form.multiples = "true";

        if (!globalData.matchProgress.hasOwnProperty(req.sessionID)) {
            async.waterfall([
                //创建比对照片目录，前端代码保证一定有图片上传，所以不至于建了目录后是空目录
                function (callback) {
                    fs.access(form.uploadDir, fs.constants.F_OK, function (err) {
                        if (err) {
                            fs.mkdir(form.uploadDir, function (err) {
                                console.log(err);
                                if (err && err.code === "EEXIST") {
                                    console.log(err.code);
                                    callback(null);
                                } else
                                    callback(err);
                            });
                        } else
                            callback(null);
                    });
                },
                //解析form
                function (callback) {
                    form.parse(req, function (err, fields, files) {
                        console.log(fields);
                        console.log(files);
                        res.set("ContentType", "applications/json");
                        if (err) {
                            res.send({state: "error", result: err});
                        } else
                            globalData.matchProgress[req.sessionID] = [Number(new Date()), 0, [], ""];
                        res.send({state: "ok", result: "比对已经开始，请稍后查询结果。期间，请不要关闭浏览器。"});
                        //res处理
                        callback(err, files);
                    })
                },
                //循环提取每张照片上的人脸
                function (files, callback) {
                    async.eachSeries(files, function (file, callback) {
                        let faceInOneFile = [];
                        async.waterfall(
                            [
                                //在数据库创建一条比对照片的doc
                                function (callback) {
                                    let doc = {
                                        photoPath: file.path,
                                        visitorId: visitorId,
                                        username: username,
                                    };
                                    filePathes.push(file.path);
                                    userToMatch.toCreate(doc, function (err, doc) { //在tomatch表中增加一条记录
                                        console.log(doc);
                                        globalData.matchProgress[req.sessionID][2].push(doc._id);
                                        callback(err);
                                    });
                                },
                                //读取一个照片文件
                                function (callback) {
                                    fs.readFile(file.path, function (err, data) {
                                        callback(err, data,);
                                    });
                                },
                                //人脸提取
                                function (data, callback) {
                                    let options = {};
                                    options["max_face_num"] = "10";
                                    let flag = true, count = 1;
                                    async.whilst(function () {
                                        return flag
                                    }, function (callback) {
                                        async.waterfall([
                                                //调用百度人脸识别接口识别人脸
                                                function (callback) {
                                                    baiduClient.detect(data.toString("base64"), "BASE64", options).then(function (result) {
                                                        console.log(JSON.stringify(result));
                                                        callback(null, result)
                                                    });
                                                },
                                                //分析人脸数据
                                                function (result, callback) {
                                                    if (result.error_msg === "SUCCESS") {
                                                        let facelist = result.result["face_list"];
                                                        async.eachSeries(facelist, function (facedata, callback) {
                                                            let face = facedata.location;
                                                            async.waterfall([
                                                                //从照片中截取人脸，并每个人脸另保存为文件
                                                                function (callback) {
                                                                    gm(data, file.path).crop(face["width"], face["height"], face["left"], face["top"]).write(file.path.replace(/\./, "-" + count + "."), function (err) {
                                                                        callback(err);
                                                                    })
                                                                },
                                                                //把人脸文件加入人脸文件数组
                                                                function (callback) {
                                                                    let facePath = file.path.replace(/\./, "-" + count + ".");
                                                                    count++;
                                                                    let face = {
                                                                        facePath: facePath,
                                                                        faceToken: facedata.face_token
                                                                    }
                                                                    faceInOneFile.push(face);
                                                                    callback(null);
                                                                },
                                                                //给已经截取的人脸区域填色，并更新到data内存中，用于下一轮的识别
                                                                function (callback) {
                                                                    gm(data, file.path).fill("#fff").drawRectangle(face["left"], face["top"], face["left"] + face["width"], face["top"] + face["height"]).toBuffer(function (err, buffer) {
                                                                        if (err) callback(err);
                                                                        console.log(buffer.copy(data));
                                                                        fs.writeFile(file.path.replace(/\./, "-aaa."), data, function (err) {
                                                                            callback(err);
                                                                        })
                                                                    })
                                                                }
                                                            ], function (err) {
                                                                callback(err);
                                                            });
                                                        }, function (err) {
                                                            callback(err);
                                                        })
                                                    } else {
                                                        flag = false;
                                                        callback(null);
                                                    }
                                                }
                                            ], function (err) {
                                                callback(err)
                                            }
                                        );
                                    }, function (err) {
                                        callback(err);
                                    });
                                },
                                //把一张照片的人脸数据更新到tomatch表中
                                function (callback) {
                                    userToMatch.toUpdate({"photoPath": file.path}, {$addToSet: {"face": faceInOneFile}}, function (err, raw) {
                                        callback(err);
                                    });
                                }
                            ], function (err) {
                                if (!err) {
                                    faceInFiles.push({"filePath": file.path, "faceInOneFile": faceInOneFile});
                                }
                                callback(err);
                            });
                    }, function (err) {
                        callback(err, files);
                    });
                },
                //人脸比对
                function (files, callback) {

                    // co(function*() {
                    //     const cursor = Thing.find({ name: /^hello/ }).cursor();
                    //     for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
                    //         console.log(doc);
                    //     }
                    // });


                    let cursor = userPhoto.toFindWithArgs({}, null, null, null).cursor();
                    let flag = true;

                    async.whilst(
                        function () {
                            return flag
                        },
                        //批量比对
                        function (callback) {
                            async.waterfall(
                                [
                                    //查出photo表中的图片数据
                                    function (callback) {
                                        cursor.next(function (err, docs) {
                                            console.log(docs);
                                            if (docs == null) {
                                                flag = 0;
                                                callback(err, []);
                                            } else
                                            // if (docs.length == 0 ) flag = 0; //因为cursor一次只能返回一条是json格式，limit不起作用
                                            {
                                                globalData.matchProgress[req.sessionID][1]++;
                                                callback(err, [docs]);
                                            }
                                        })
                                    },
                                    //比对
                                    function (docs, callback) {
                                        console.log(docs);
                                        async.eachSeries(docs, function (doc, callback) {
                                            //这层似乎没必要，因为cursor一次只能返回一条，limit不起作用
                                            async.eachSeries(faceInFiles, function (file, callback) {
                                                    let matchedInOnePhoto = [];

                                                    async.eachSeries(file.faceInOneFile, function (face, callback) {

                                                            console.log(face);
                                                            console.log(doc);
                                                            baiduClient.match([{
                                                                image: face.faceToken,
                                                                image_type: 'FACE_TOKEN'
                                                            }, {
                                                                image: doc.faceToken,
                                                                image_type: 'FACE_TOKEN'
                                                            }]).then(function (result) {
                                                                console.log('<match>: ' + JSON.stringify(result));
                                                                if (result.error_msg === "SUCCESS" && (result.result.score > 70 || result.result.score == null)) {
                                                                    //匹配成功，做近一步操作
                                                                    console.log("matched");
                                                                    matchedInOnePhoto.push([doc.photoPath, doc.username, doc.docname, face.facePath, result.result.score]);
                                                                    console.log(matchedInOnePhoto);
                                                                }
                                                                // callback(null);
                                                            }).then(function () {
                                                                //暂停0.5秒，因为baidu的接口一秒只能掉2次，超过就会报错。
                                                                setTimeout(function () {
                                                                    callback(null);
                                                                }, 500);
                                                            });


                                                        }, function (err) {
                                                            if (!err && matchedInOnePhoto.length > 0) {
                                                                if (matchedInPhotos.hasOwnProperty(file.filePath)) {
                                                                    matchedInPhotos[file.filePath] = matchedInPhotos[file.filePath].concat(matchedInOnePhoto);
                                                                } else {
                                                                    matchedInPhotos[file.filePath] = matchedInOnePhoto;
                                                                }
                                                            }
                                                            callback(err)
                                                        }
                                                    );


                                                }, function (err) {

                                                    callback(err)
                                                }
                                            );
                                        }, function (err) {
                                            callback(err);
                                        });
                                    }
                                ],
                                function (err) {
                                    callback(err);
                                }
                            );
                        },
                        function (err) {
                            callback(err, files);
                        });
                    // callback(err, files);
                },
                //文件处理，移动
                //把上传匹配到照片复制一份到匹配上的档案里的matched目录里面
                function (files, callback) {

                    if (JSON.stringify(matchedInPhotos) != "{}") {
                        co(function* () {
                            for (let match in matchedInPhotos) {
                                for (let n of matchedInPhotos[match]) {

                                    let docdir = "./data/users/" + n[1] + "/" + n[2] + "/matched";

                                    //检测是否存在matched目录
                                    try {
                                        let result = yield function (cb) {
                                            fs.stat(docdir, cb)
                                        };
                                    } catch (e) {
                                        //如果没有matched目录，就新建一个。
                                        if (e.code === 'ENOENT') {
                                            yield function (cb) {
                                                fs.mkdir(docdir, cb)
                                            }
                                        }
                                        else
                                            throw e;
                                    }

                                    //照片复制一份到匹配上的档案里的matched目录里面
                                    yield function (cb) {
                                        let m = match.toString().split("\\").pop();
                                        console.log(m);
                                        fs.copyFile(match, docdir + "/" + m, cb)
                                    };


                                    /*                          for (let n of m) {
                                                                  let docdir = "./data/users/" + n[1] + "/" + n[2] + "/matched";

                                                                  //检测是否存在matched目录
                                                                  try {
                                                                      let result = yield function (cb) {
                                                                          fs.stat(docdir, cb)
                                                                      };
                                                                  } catch (e) {
                                                                      //如果没有matched目录，就新建一个。
                                                                      if (e.code === 'ENOENT') {
                                                                          yield function (cb) {
                                                                              fs.mkdir(docdir, cb)
                                                                          }
                                                                      }
                                                                      else
                                                                          throw e;
                                                                  }

                                                                  //照片复制一份到匹配上的档案里的matched目录里面
                                                                  yield function (cb) {
                                                                      let m = match.toString().split("\\").pop();
                                                                      console.log(m);
                                                                      fs.copyFile(match, docdir + "/" + m, cb)
                                                                  };
                                                              }*/
                                }
                            }
                            // callback(null);
                        }).catch(function (err) {
                            callback(err);
                        });
                    }
                    callback(null, matchedInPhotos);
                },
                //结果写入数据库
                //tomatch表中更新matchedPhoto，isfinished
                //doc表中更新matchedQty, matchedId

                function (matchedInPhotos, callback) {
                    co(function* () {
                        if (JSON.stringify(matchedInPhotos) != "{}") {
                            for (let match in matchedInPhotos) {
                                let doc = yield function (cb) {
                                    console.log(" matchedInPhotos[match]", matchedInPhotos[match]);
                                    userToMatch.toFindOneAndUpdate({photoPath: match}, {
                                        $push: {matchedPhoto: {$each: matchedInPhotos[match]}}
                                    }, {lean: true}, cb);
                                };
                                console.log(doc);
                                for (let m of matchedInPhotos[match]) {
                                    /*                            for (let n of m) {
                                                                    yield function (cb) {
                                                                        userDoc.toFindOneAndUpdate({docname: n[2]}
                                                                        , {$inc : {matchedQty : 1}, $addToSet: {matchedId: doc._id}}, cb);
                                                                    }
                                                                }*/
                                    yield function (cb) {
                                        userDoc.toFindOneAndUpdate({docname: m[2]}
                                            , {$inc: {matchedQty: 1}, $addToSet: {matchedId: doc._id}}, cb);
                                    }
                                }

                            }
                            //matchedInPhotos.file1 : [[1,2,3,4],[5,6,7,8]]
                        }

                        for (let i = 0, length = globalData.matchProgress[req.sessionID][2].length; i < length; i++) {
                            yield function (cb) {
                                userToMatch.toFindOneAndUpdate({_id : globalData.matchProgress[req.sessionID][2][i]}, {
                                    isFinished: true
                                }, cb);
                            }
                        }
                        globalData.matchProgress[req.sessionID][3] = "finished";

                    });
                    callback(null);
                }
            ], function (err) {
                if (err) {
                    globalData.matchProgress[req.sessionID][1] = "error";
                    throw err;
                }
            });
        }else{
            res.set("ContentType", "applications/json");
            res.send({state: "error", result : "前一次比对还未完成，请稍后试！"});
        }


        /*   //在上面重写
                //创建档案目录
                fs.mkdir(form.uploadDir, function (err) {
                    if (err) {
                        res.send("error");
                        throw err;
                    }

                    form.parse(req, function (err, fields, files) {
                        if (err) throw err;
                        console.log(fields);
                        console.log(files);




                     async.eachSeries(files, function (file, callback) {
                            let doc = {
                                photoPath: file.path,
                                visitorId: visitorId,
                                username: username,
                            }
                            //在数据库创建一条比对照片的doc
                            userToMatch.toCreate(doc, function (err, doc) { //在doc表中增肌一条记录
                                if (err) callback(err);
                                //1、调用人脸提取
                                fs.readFile(file.path, function (err, data) {
                                    if (err) callback(err);
                                    let options = {};
                                    options["max_face_num"] = "1";
                                    let faceInFiles = [], flag = true, count = 1;
                                    async.whilst(function () {
                                        return flag
                                    }, function (callback) {
                                        baiduClient.detect(data.toString("base64"), "BASE64", options).then(function (result) {
                                            console.log(JSON.stringify(result));
                                            if (result.error_msg === "SUCCESS") {
                                                let facelist = result.result["face_list"];
                                                async.eachSeries(facelist, function (facedata, callback) {
                                                    let face = facedata.location;
                                                    gm(data, file.path).crop(face["width"], face["height"],face["left"], face["top"]).
                                                    write(file.path.replace(/\./, "-" + count + "."), function (err) {
                                                        if (err) callback(err);
                                                        faceInFiles.push(file.path.replace(/\./, "-" + count + "."));
                                                        count++;
                                                        gm(data, file.path).fill("#fff").drawRectangle(face["left"], face["top"], face["left"]+face["width"], face["top"]+face["height"]).
                                                            toBuffer(function(err, buffer){
                                                                if (err) callback(err);
                                                                console.log(buffer.copy(data));
                                                                fs.writeFile(file.path.replace(/\./, "-aaa."),data,function(err){
                                                                    callback(err);
                                                                })
                                                        })
                                                    })
                                                }, function (err) {
                                                    if (err) callback(err);
                                                    callback(null);
                                                });
                                            }
                                            else {
                                                flag = false;
                                                callback(null);
                                            }
                                        }).catch(function (err) {
                                            callback(err);
                                        })
                                    }, function (err) {
                                        callback(err);
                                    })
                                });
                                console.log("here now");
                                //2、人脸比对
                                //3、文件处理
                                //4、结果写入数据库

                            })
                        }, function (err) {
                            if (err) throw err;
                        });

            });
        }); */
    },
    showPrivacyImg : function(req, res){
        console.log("showPrivacyImg");

        //图片地址为/img/:id
        //id为session中的visitorId对图片路径进行对称加解密

        let path = req.params.id;
        path = funcs.deCryptoDES(path,globalData.cryptoAlro, globalData.cryptoKey, globalData.iv);
        console.log(path);
        fs.readFile(path,function(err,data){
            if(err) throw err;
            res.set('Content-Type',"image/jpeg");
            res.send(data);
        });
    },
    saveUpper : function(req, res){
        console.log('saveUpper');
        console.log(req.body);
        //把信息更新到tomatch表中
        userToMatch.toUpdateAll({visitorId : req.sessionID},{upperName: req.body.name, upperEmail: req.body.email, upperPhone: req.body.phone},function(err, raw){
            if(err) throw err;
            console.log('saveUpper-raw', raw);
        });
        //把信息更新到message表中,sender:system, receiver:username, content: upper的信息，user的照片链接，upper的照片链接"

        let messages ={};
        userToMatch.toFindAll({visitorId : req.sessionID}, function (err, docs) {
            console.log(docs);
            //形成以receiver为key的对象
            //{receiver: [[寻人方照片文件名，寻人方档案号，upper的照片文件名 ],。。。。 }
                for (let doc of docs) {
                    for (let n of doc.matchedPhoto) {
                            if (messages.hasOwnProperty(n[1])) {
                                messages[n[1]].push(["/img/"+funcs.enCryptoDES(n[0], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)
                                    , "/img/"+funcs.enCryptoDES(n[1], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)
                                    , "/img/"+funcs.enCryptoDES(doc.photoPath, globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)]);
                            } else {
                                messages[n[1]] = [["/img/"+funcs.enCryptoDES(n[0], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)
                                    , "/img/"+funcs.enCryptoDES(n[1], globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)
                                    , "/img/"+funcs.enCryptoDES(doc.photoPath, globalData.cryptoAlro, globalData.cryptoKey, globalData.iv)]];
                            }

                    }
                }

                co(function *(){
                for (let m in messages) {
                    let content = "";
                    for (let n of messages[m]){
                        content +=`<div class="row m-2">
                                <div class="col-md-6">
                                    <img class="img-thumbnail" src="${n[0]}" alt="" style="width:100%">
                                </div>
                                <div class="col-md-6">
                                  <img class="img-thumbnail" src="${n[2]}" alt="" style="width:100%">
                                </div>
                            </div>`;
                    }
                    let message = {
                        sender: "system",
                        receiver: m,
                        content: `${m}您好，<br>
                                    有网友提供与您档案中照片有相似的照片，具体信息如下，<br>
                                    ${content}<br>
                                    网友的联系方式为，<br>
                                    ${req.body.name}先生/女士，电话为${req.body.phone}，邮箱为${req.body.email}`
                    }

                    yield function(cb){
                        userMessage.toCreate(message,cb);
                    }
                }
                });
            }
        );
        res.send("ok");
    },
    randomDocs : function(req, res){
        let data = [];
        co(function* (){
/*            let docs = [];
            while(docs.length<4){ //获取的数量，要和前端的匹配
                let d = yield function(cb){
                    userDoc.aggregate([{$match : {isDeleted : false}}, {$sample : {size : 1}}],cb);
                };
                if (!d[0].isDeleted)
                    docs.push(d[0]);
            }*/
        let docs =  yield function(cb) {
            userDoc.aggregate([{$match: {isDeleted: false}}, {$sample: {size: 4}}], cb);
            //there may have a effective problem, when high amount of docs in db.
        }
        for (let i = 0, length = docs.length; i < length; i++){
                let d = {
                    name : docs[i].name,
                    description : docs[i].description,
                    lostdate : docs[i].lostDate
                }
                    let doc = yield function(cb){
                        userPhoto.toFind({docname : docs[i]["docname"]},cb);
                    }
                    d.photoPath = "/img/"+funcs.enCryptoDES(doc["photoPath"],globalData.cryptoAlro, globalData.cryptoKey, globalData.iv);
                data.push(d);
            }
            res.send(data);
        });
    },
    chkUsername : function(req, res){
        console.log("chkUsername");
        userUser.toFind({username : req.query.username},function(err, doc){
           if (err) throw err;
           if (doc)
               res.send(false);
           else
               res.send(true);
       })
    }
}
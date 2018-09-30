/* Practice by JERRY, created on 2018/8/23*/
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

module.exports = {
    //删除y一批文件或文件夹，全异步结合迭代
    //dirpath是文件或者目录绝对路径的数组,
    removePath: function (dirpath, callback) {
        if (!(dirpath instanceof Array)) {
            console.log("dirpath is not array");
            callback("error","dirpath is not array");
        }
        if(dirpath.length === 0){
            console.log("dirpath is empty.");
            callback("error","dirpath is empty.");
        }

        let filepath = dirpath.shift();
        fs.stat(filepath, function (err, stats) {
            if (err) {
                console.log("fs.stat " + filepath + "error ", err);
                callback(err, "fs.stat " + filepath + "error");
            }
            if (stats.isFile()) {
                //如果是文件
                fs.unlink(filepath, function (err) {
                    if (err) {
                        console.log("remove " + filepath + " failed! ", err);
                        callback(err, "remove " + filepath + " failed!");
                    }
                    console.log("remove " + filepath + " done!");
                    if (dirpath.length !== 0) {
                        module.exports.removePath(dirpath, function (err, result) {  //进入下一层迭代
                            if (err) callback(err, result);
                            callback(err, result);  //必须要写，用于返回上层迭代
                        })
                    } else {
                        console.log("all files removed in this branch, file.");
                        callback(err, "all files removed in this branch.");
                        //迭代尽头
                    }
                })
            } else {
                //如果是目录
                fs.readdir(filepath, function (err, files) {
                    if (files.length === 0) {
                        //如果是空文件夹
                        fs.rmdir(filepath, function (err) {
                            if (err) {
                                console.log("remove " + filepath + " failed!");
                                callback(err, "remove " + filepath + " failed!");
                            }
                            console.log("remove " + filepath + " done!");
                            if (dirpath.length !== 0) {
                                module.exports.removePath(dirpath, function (err, result) { //进入下一层迭代
                                    if (err) callback(err, result);
                                    callback(err, result);  //必须要写，用于返回上层迭代
                                })
                            } else {
                                console.log("all files removed in this branch, dir-1.");
                                callback(err, "all files removed in this branch.");
                            }
                        })
                    } else {
                        //如果文件夹非空
                            for (let i = 0; i < files.length; i++){
                                files[i] = filepath + "/" +files[i];
                            }
                        console.log(files);
                        module.exports.removePath(files, function (err, result) {  //进入下一层迭代
                            console.log("heheda");
                            console.log(result);
                            if (err) {
                                callback(err, result);
                            }
                                fs.rmdir(filepath, function (err) {
                                    if (err) {
                                        console.log("remove " + filepath + " failed!");
                                        callback(err, "remove " + filepath + " failed!");
                                    }
                                    console.log("remove " + filepath + " done!");

                                    if (dirpath.length !== 0) {
                                        module.exports.removePath(dirpath, function (err, result) {
                                            if (err) callback(err, result);
                                            callback(err, result);  //必须要写，用于返回上层迭代
                                        })
                                    } else {
                                        console.log("all files removed in this branch, dir-2.");
                                        callback(err, "all files removed in this branch, dir."); //必须要写，用于返回上层迭代
                                    }
                                })
                        })
                    }

                })
            }
        })
    },
    //删除文件或文件夹，全同步
    removePathSync: function (dirpath) {
        if (!(dirpath instanceof Array)) {
            console.log("dirpath is not array");
            return {"result":"dirpath is not array"};
        }
        if(dirpath.length === 0){
            console.log("dirpath is empty.");
            return {"result":"dirpath is empty."};
        }
        for (let i = 0, length = dirpath.length; i < length; i++){
            let stats = fs.statSync(dirpath[i]);
            if(stats.isFile()){
                //是文件就直接删除
                fs.unlinkSync(dirpath[i]);
            }else{
                //是目录
                let filelist = fs.readdirSync(dirpath[i]);
                if (filelist.length === 0){
                    //空目录，立即删除目录
                    fs.rmdirSync(dirpath[i]);
                }else{
                    //非空目录，迭代进入下一次目录
                    for (let j = 0, length = filelist.length; j < length; j++){
                        filelist[j] = dirpath[i] + "/" + filelist[j];
                    }
                    module.exports.removePathSync(filelist);   //进入下一层迭代
                    fs.rmdirSync(dirpath[i]);
                }
            }
        }
        console.log("remove " + dirpath + "done!");
        return {"result" : "remove " + dirpath + "done!"}
    },
    enCryptoDES : function(content, algorithm, key, iv= "it's a testing .", options){

        let cipher = crypto.createCipheriv(algorithm, key, iv, options);
        let output = cipher.update(content, "utf8", "hex");
        console.log(output);
        output += cipher.final("hex");
        return output;
    },
    deCryptoDES : function (content, algorithm, key, iv= "it's a testing .", options) {
        let decipher = crypto.createDecipheriv(algorithm, key, iv, options);
        let output = decipher.update(content, "hex", "utf8");
        console.log(output);
        output += decipher.final("utf8");
        return output;
    },
    enCrypto : function (content, key="guess what", algorithm="sha1") {
        let hmac = crypto.createHmac(algorithm,key);
        hmac.update(content);
        return hmac.digest("hex");
    }
}
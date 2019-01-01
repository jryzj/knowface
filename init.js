/* Practice by JERRY, created on 2018/9/13*/
const dao = require("./models/mongooseDao");
const co = require("co");
const globalData = require("./models/global_data");
const userGlobal = dao.Global;

//初始化系统
module.exports = {
    init : function()
    {
        console.log("init");
        co(function *(){
            yield function(cb){
                module.exports.initDB(cb);
            };
            console.log("middle");
            yield function(cb){
                module.exports.initGlobal(cb);
            };

        }).catch(function (err){
            if (err) throw err;
        });
        console.log("after init");
        globalData.matchProgressChk(60000);
    },
    initDB : function(callback)
    {
        let userGlobal = dao.Global;

        co(function *(){

            let count = yield function(cb){
                userGlobal.countDocuments({},cb);
            }

            let userQty = yield function(cb){
                dao.User.countDocuments({isDeleted : false},cb);
            }

            let docQty = yield function(cb){
                dao.Doc.countDocuments({isDeleted : false},cb);
            }

            let photoQty = yield function(cb){
                dao.Photo.countDocuments({isDeleted : false},cb);
            }

            let statics = {
                name : "kface",
                userQty : userQty,
                docQty : docQty,
                photoQty : photoQty //根据需要增加初始化数据
            }

            if (count == 0 ){
                yield function(cb){
                    userGlobal.toCreate(statics,cb)
                };
            }else{
                yield function(cb){
                    userGlobal.toUpdate({name : "kface"}, statics,cb)
                };
            }
            callback(null);
        }).catch(function(err){
            callback(err);
        });
    },
    initGlobal : function (callback) {
        co(function *(){
            yield function(cb){
                userGlobal.find({name : "kface"}, function (err, doc) {
                    globalData.photoQty =  doc[0].photoQty;
                    console.log("globalData.photoQty",globalData.photoQty);
                })
            }
            callback(null);
        }).catch(function(err){
            callback;
        })
    }
}

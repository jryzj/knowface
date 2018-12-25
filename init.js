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
        co(function *(cb){
            module.exports.initDB(cb);
            console.log("middle");
            module.exports.initGlobal(cb);
        }).catch(function (err){
            if (err) throw err;
        })
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
            if (count == 0 ){
                let statics = {
                    name : "kface",
                    userQty : 0,
                    docQty : 0,
                    photoQty : 0 //根据需要增加初始化数据
                }
                yield function(cb){
                    userGlobal.toCreate({statics},cb)
                };
                callback(null);
            }
        }).catch(function(err){
            callback(err);
        });
    },
    initGlobal : function (callback) {
        co(function *(){
            yield function(cb){
                userGlobal.find({name : "kface"}, function (err, doc) {
                    console.log(doc.photoQty);
                    globalData.photoQty =  doc.photoQty;
                })
            }
            callback(null);
        }).catch(function(err){
            callback;
        })
    }
}

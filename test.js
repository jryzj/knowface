/* Practice by JERRY, created on 2018/7/27*/

const Dao = require("./models/mongooseDao");
const fs = require("fs");
const funcs = require("./lib/funcs");
const gm = require("gm");
const co =require("co");

const userPhoto = Dao.Photo;
const userDoc = Dao.Doc;
const userGlobal = Dao.Global;
const userToMatch = Dao.ToMatch;


// let User = Dao.User;
// let Doc = Dao.Doc;
// let MatchedDoc = Dao.MatchedDoc;
// let Message = Dao.Message;
//
// let user1 = {
//     //userId : "user2",
//     username : "jry",
//     password : "123456",
//     name : "jerry",
//     email : "jerry@163.com",
//     phone : "1234567890",
//     avator : "/avator",
//     userDir : "user1",
//     createTime : Date.now(),
//     updateTime : Date.now(),
//     group : "user",
//     isDeleted : false,
//     docQty : 0,
//     docId : [],
//     isLogin : false
// };

/*User.toCreate(user1, function(err, doc){
    if (err) throw err;
    console.log("test.js" + doc);
});*/

/*User.toFindAll({name : "jerry"}, function (err, docs) {
    if (err) throw err;
    console.log(docs.length);
})*/

/*
User.toRemove({name : "toUpdate"}, function (err) {
    if (err) throw err;
});
*/


// console.log("hhrh");


/*
User.find({}).exec(function (err, result) {
    if (err) throw err;
    console.log(result);
})
*/

// let doc1 = {
//     userId : "5b5ac5759e39c43464d261f7",
//     name : "克林顿",
//     appearance : "大鼻子",
//     lostLocation : "迈阿密",
//     lostDate : "2018-01-01",
//     description : "美国总统",
//     photoDir : "1532854407",
//     photos : ["1.jpg", "2.jpg"],
//     matchDir : ["matched"],
//     matchedQty : 0,
//     matchedId : [],
//     isDeleted : false
// };
//
// let doc2 = {
//     userId : "5b5ac5759e39c43464d261f7",
//     name : "老布什",
//     appearance : "长脸",
//     lostLocation : "休斯顿",
//     lostDate : "2018-01-01",
//     description : "美国总统",
//     photoDir : "1532854408",
//     photos : ["1.jpg", "2.jpg"],
//     matchDir : ["matched"],
//     matchedQty : 0,
//     matchedId : [],
//     isDeleted : false
// };
//
// Doc.toCreate([doc1,doc2], function (err, docs) {
//     if (err) throw err;
//     console.log(docs);
// })


// fs.readdir("./", function (err, files) {
//     console.log(files);
// })

/*funs.removePath(["./testdir"], function (err, result) {
    if (err) throw err;
    console.log(result);
})*/

// funs.removePathSync(["./testdir"], function (result) {
//     console.log(result);
// })

// fs.stat("./tmp", function (err, stats) {
//     funs.removePathSync(["./testdir"], function (result) {
//         console.log(result);
//     });
// })
// console.log("helllooooo");

/*
userPhoto.toRemove({"docname" : ["jry1-1535125772341"]}, function (err, docs) {
    console.log(err, docs);
})*/


// userPhoto.toFindAll({"docname" :  "jry1-1535372668534", "faceToken" : {"$in" : ["", null]}}, function (err, docs){
//     console.log(docs);
// })



//百度人脸比对测试
//1、创建一个client
// var AipFaceClient = require("baidu-aip-sdk").face;
//
// // 设置APPID/AK/SK
// var APP_ID = "11524495";
// var API_KEY = "8detGa2ANmUYgeZpHcsSjihv";
// var SECRET_KEY = "QF4XuqNGe9ZMTmDB9N14Rb8BCzy3WisE";
//
// // 新建一个对象，建议只保存一个对象调用服务接口
// var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
//
// //2、比对照片
//
// client.match([{
//     image: new Buffer(fs.readFileSync('./public/img/ttt.jpg')).toString('base64'),
//     image_type: 'BASE64'
// },{
//     image: new Buffer(fs.readFileSync('./public/img/ttt2.jpg')).toString('base64'),
//     image_type: 'BASE64'
// }]).then(function (result) {
//     console.log('<match>: ' + JSON.stringify(result));
// });


//
//百度人脸入库
//1、创建一个客户端
// var AipFaceClient = require("baidu-aip-sdk").face;
//
// // 设置APPID/AK/SK
// var APP_ID = "11524495";
// var API_KEY = "8detGa2ANmUYgeZpHcsSjihv";
// var SECRET_KEY = "QF4XuqNGe9ZMTmDB9N14Rb8BCzy3WisE";
//
// // 新建一个对象，建议只保存一个对象调用服务接口
// var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
//
// //2、人脸检测
//
// let  image = new Buffer(fs.readFileSync("./public/img/tttg20.jpg")).toString("base64");
// let imageType = "BASE64";
// let options = {};
// options["max_face_num"] = "10";
// client.detect(image, imageType, options).then(function(result) {
//     console.log(JSON.stringify(result));

    // //3、人脸注册
    //
    // // var limage = result.result.face_list[0].face_token;
    //
    // var limageType = "FACE_TOKEN";
    //
    // var groupId = "group_study"; //如果库里组不存在，执行后，会新建组
    //
    // var userId = "0001";
    //
    // let facelist = result.result.face_list;
    //
    // for (let i = 0, length = facelist.length; i < length ; i++)
    // client.addUser(facelist[i].face_token, limageType, groupId, userId).then(function(result) {
    //     console.log(JSON.stringify(result));
    // }).catch(function(err) {
    //     // 如果发生网络错误
    //     console.log(err);
    // });

// }).catch(function(err) {
//     // 如果发生网络错误
//     console.log(err);
// });



// gm("./public/img/tttg20.jpg").crop(139,127,3957,1435).write("./public/img/tttg20-gm1.jpg", function(err){
//     if(err) throw err;
// })



/*
const client = require("./lib/baiduFaceApi").Client;
let filedata = fs.readFileSync("./public/img/tttg20.jpg");
let  image = new Buffer(filedata).toString("base64");
let imageType = "BASE64";
let options = {};
options["max_face_num"] = "1";
client.detect(image, imageType, options).then(function(result) {
    console.log(JSON.stringify(result));
    let face = result.result.face_list[0].location;
    console.log(face);
    /!* gm(filedata, "tttg20.jpg").fill("#fff").drawRectangle(face["left"], face["top"], face["left"]+face["width"], face["top"]+face["height"]).write("./public/img/tttg20-1.jpg",function (err) {
         if (err) throw err;
     })*!/


    gm(filedata, "tttg20.jpg").size({bufferStream: true}, function (err, size) {
        if (err) throw err;
        console.log("rgfdaf");
        this.fill("#fff");
        this.drawRectangle(face["left"], face["top"], face["left"] + face["width"], face["top"] + face["height"]);
        this.write("./public/img/tttg20-1.jpg", function (err) {
            if (err) throw err;
        })
    });

});*/

// console.log("/erer/wwe.jpg".replace(/\./,"-1" + "."));

/*
let cursor = userPhoto.find({"username" : "sdfsdf"},null,{limit:3}).cursor();
cursor.next( function(err, docs){
    console.log(docs);
})*/
/*

function test(){
    return 'b';
}

function* func(){
    var aq = yield 'ax';
    console.log('gen:',aq);// gen:1
    var b = yield test();
    console.log('gen:',b);// gen:2
}
var func2 = func();
var aa = func2.next();
console.log('next:', aa);// next: { value: 'ax', done: false }
var bb = func2.next(1);
console.log('next:', bb);// next: { value: 'b', done: false }
var cc = func2.next(2);
console.log('next:', cc);// next: { value: undefined, done: true }
*/




/*function test(){
    return 'b';}

function* func(){
var a = yield 'a';
console.log('gen:',a);// gen: undefined
var b = yield test();
console.log('gen:',b);// gen: undefined
}

var func1 = func();
var a = func1.next();
console.log('next:', a);// next: { value: 'a', done: false }
 var b = func1.next();
 console.log('next:', b);// next: { value: 'b', done: false }
 var c = func1.next();
 console.log('next:', c);// next: { value: undefined, done: true }*/





//用co试试

/*co(function *(){
    let result = yield function(cb) {
        fs.stat("./public/img/tttg20-112.jpg",cb)
    };
    console.log(result);
}).catch(function(err){
    console.log("catch");
    if (err) throw err;
})*/


/*let objs = {
    o1 : "o11",
    o2 : "o22"};


for (let o in objs) {
    console.log(objs[o]);
}

let objs1 = ["o11", "o22"];
for (let o of objs1){
    console.log(o);
}
*/


/*let a = 'jry1/jry1-12345678/qwer.jpg';
let k = "1234567890abcdef12345678";

let b=funcs.enCryptoDES(a, "aes192", k);
console.log(b);

console.log(funcs.deCryptoDES(b, "aes192", k));*/

/*
userGlobal.toFind({},function(err,doc){
    if (err) console.log(err)
        else
        console.log(doc);
});*/

/*userGlobal.countDocuments({},function(err,count){
    if (err) console.log(err)
    else
        console.log(count);
});*/


/*
userToMatch.toFindAll({}, function(err, docs){
    console.log(docs);
});*/


/*let obj ={
    a :1,
    b: function(){
        console.log(this.c);
    },
    c : this.a
}

obj.b();*/

/*
let c = funcs.enCrypto("12345678", "jry5");
console.log(c);*/

/*
jsonString = [{'id':11,'name':'A1','status':1,'desc':'hello A1!'
                ,listB:[
                                  {'id':21,'name':'B1','status':1,'desc':'hello B1!'},
                                  {'id':22,'name':'B2','status':1,'desc':'hello B2!'}]},
                                  {'id':12,'name':'A1','status':1,'desc':'hello A2!',listB:[
                                  {'id':23,'name':'B3','status':1,'desc':'hello B3!'},
                                  {'id':24,'name':'B4','status':1,'desc':'hello B4!'}]}];*/

// let obj = [1,2,{name: "jerry", score : {math : 89, english: 78, others : [34, 56]}}];

// let objcopy = funcs.objCopy(obj, true);
/*let objcopy = funcs.objCopy(jsonString, true, true);

console.log(JSON.stringify(objcopy));


let obj = JSON.stringify(jsonString);
obj = JSON.parse(obj);
console.log("obj", obj);*/



Dao.Message.toUpdate({_id : "5ba2064fe2ad30566c3f7ff8"}, {isRead : true}, function(err, raw){
    console.log(raw);
})
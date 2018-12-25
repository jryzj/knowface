/* Practice by JERRY, created on 2018/7/24*/
const mongoose = require("mongoose");
const db = mongoose.createConnection("mongodb://localhost:27017/knowface", { useNewUrlParser: true });

db.once("open", function(){
    console.log("mongooseDao : db on connection!");
});

db.on('error', console.error.bind(console, 'connection error:'));

exports.db = db;

let generalMethods = {
    toCreate : function (docs, callback) {
        this.create(docs, function(err, docs){
            callback(err, docs);
        });
    },
    toCreateWithOpt : function (docs, options, callback){
        this.create(docs, options, function(err, docs){
            callback(err, docs);
        });
    },
    //Model.create()如果你正在处理一个非常大的批量，那么插入是一个不好的方法。它会很慢。
    // 在这种情况下，你应该使用Model.collection.insert。使用Model.collection.insert它只需几秒钟。
    toInsertMany : function (docs, options, callback){
        this.insertMany(docs, options, function(err, docs){
            callback (err, docs);
        });
    },
    toFind : function (conditions, callback) {
        conditions.isDeleted = false;
        this.findOne(conditions, function (err, doc) {
            callback(err, doc);
        });
    },
    toFindAll : function (conditions, callback) {
        console.log(conditions, callback);
        conditions.isDeleted = false;
/*        this.find(conditions, function (err, docs) {
            callback(err, docs);
        });*/
        let This = this;
        if(callback){
            This.find(conditions, function (err, docs) {
                callback(err, docs);
            });
        }else{
            return new Promise(function(resolve, reject) {
                This.find(conditions, function (err, docs) {
                    if (err)
                        reject();
                    else
                        resolve(docs);
                })
            });
        }
    },
    toFindWithArgs : function (conditions, projection, options, callback) {
        conditions.isDeleted = false;
    return this.find(conditions, projection, options, function (err, docs) {
        if (typeof callback === "function")
                callback(err, docs);
    });
    },
    toUpdate : function (conditions, doc, callback) {
        conditions.isDeleted = false;
        this.update(conditions, doc, function (err, raw) {
            callback(err, raw);
        });
    },
    toUpdateWithOpt : function (conditions, doc, options, callback) {
        conditions.isDeleted = false;
        this.update(conditions, doc,options, function (err, raw) {
            callback(err, raw);
        });
    },
    toUpdateAll : function (conditions, doc, options, callback) {
        conditions.isDeleted = false;
        this.updateMany(conditions, doc,options, function (err, raw) {
            callback(err, raw);
        });
    },
    toFindOneAndUpdate : function(conditions, update, options, optionlean, callback){
        conditions.isDeleted = false;
      this.findOneAndUpdate(conditions, update, options, optionlean, function (err, doc) {
          callback(err, doc);
      });
    },
    toRemove : function (conditions, callback) {

/*        this.findOneAndDelete(conditions, function (err, doc) {
            callback(err, doc);
        });*/


        let This = this;
        if(callback){
            This.findOneAndUpdate(conditions, {isDeleted : true},function (err, doc) {
                callback(err, doc);
            });
        }else{
            return new Promise(function(resolve, reject) {
                This.findOneAndUpdate(conditions, {isDeleted : true},function (err, doc) {
                    if (err)
                        reject();
                    else
                        resolve(doc);
                })
            });
        }
    },
    toRemoveWithOpt : function (conditions, options, callback) {
        this.findOneAndUpdate(conditions, {isDeleted : true}, options, function (err, doc) {
            callback(err, doc);
        });

/*    this.findOneAndDelete(conditions, options, function (err, doc) {
        callback(err, doc);
    });*/
    },
    toRemoveAll : function (conditions, callback) {
/*        this.update(conditions, {isDeleted : true}, function (err) {
            callback(err);
        });*/
/*        this.remove(conditions, function (err) {
            callback(err);
        });*/

        let This = this;
        if(callback){
            This.updateMany(conditions, {isDeleted : true}, function (err) {
                callback(err);
            });
        }else{
            return new Promise(function(resolve, reject) {
                This.updateMany(conditions, {isDeleted : true}, function (err) {
                    if (err)
                        reject();
                    else
                        resolve(1);
                })
            });
        }



    },
    toPromisify : function (fn){
        let This = this;

      /*  //successful code phrase 1
        let This = this;
        let func = fn;
        for (let i = 0 , length = arguments.length; i < length; i++)
        {
            arguments[i] = arguments[i+1];
        }
        arguments.length --;
        let args =  Array.prototype.slice.call(arguments);
            return new Promise(function(resolve, reject) {
                let cb = function (err, docs) {
                    if (err)
                        reject(err);
                    else
                        resolve(docs);
                }
                args.push(cb);
                console.log(args);
                func.apply(This, args);
            });*/

      //phrase 2, failed!
        /*return function(){
            let argvs = Array.prototype.slice.call(arguments);
            return new Promise(function(resolve, reject){
                let cb = function (err, docs) {
                    if (err)
                        reject(err);
                    else
                        resolve(docs);
                };
                argvs.push(cb);
                console.log(argvs);
                fn.apply(This, argvs);
            })

        }*/
        }
};

const userSchema = mongoose.Schema({
  //  userId : String,
    username : String,
    password : String,
    name : String,
    email : String,
    phone : String,
    avator : String,
    userDir : String,
    createTime : {type : Date, default : Date.now},
    updateTime : Date,
    group : {type : String, default : "member"},
    isDeleted : {type : Boolean, default : false},
    docQty : {type : Number, default : 0},
    docIds : {type : Array, default : []},
    isLogin : {type : Boolean, default : false},
},{ timestamps: true });

/*userSchema.statics.insert = function (docs, callback) {
    this.create(docs, function(err, docs){
        callback(err, docs);
    });
};

userSchema.statics.insertWithOpt = function (docs, options, callback){
    this.create(docs, options, function(err, docs){
        callback(err, docs);
    });
};

userSchema.statics.toFind = function (conditions, callback) {

    this.find(conditions, function (err, docs) {
        callback(err, docs);
    });
};


userSchema.statics.toFindWithArgs = function (conditions, projection, options, callback) {
    this.find(conditions, projection, options, function (err, docs) {
        callback(err, docs);
    });
};

userSchema.statics.toUpdate = function (conditions, doc, callback) {
    this.update(conditions, doc, function (err, raw) {
        callback(err, raw);
    });
};

userSchema.statics.toUpdateWithOpt = function (conditions, doc, options, callback) {
    this.update(conditions, doc,options, function (err, raw) {
        callback(err, raw);
    });
};

userSchema.statics.toRemove = function (conditions, callback) {
    this.update(conditions, function (err) {
        callback(err);
    });
};
*/

userSchema.statics.toCreate = generalMethods.toCreate;
userSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
userSchema.statics.toFind = generalMethods.toFind;
userSchema.statics.toFindAll = generalMethods.toFindAll;
userSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
userSchema.statics.toUpdate = generalMethods.toUpdate;
userSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
userSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
userSchema.statics.toRemove = generalMethods.toRemove;
userSchema.statics.toRemoveAll = generalMethods.toRemoveAll;
userSchema.statics.toPromisify= generalMethods.toPromisify;

let User = db.model("User", userSchema);
exports.User = User;

const docSchema = mongoose.Schema({
    // userId : String,
    docname : String,
    username : String,
    name : String,
    appearance : String,
    lostLocation : String,
    lostDate : String,
    description : String,
    photoDir : String,
    photos :{type : Array, default : []},
    // matchDir : String,
    matchedQty : {type : Number, default : 0},
    matchedId :  {type : Array, default : []},
    isClosed : {type : Boolean, default : false},
    isDeleted : {type : Boolean, default : false}
},{timestamps : true});


docSchema.statics.toCreate = generalMethods.toCreate;
docSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
docSchema.statics.toFind = generalMethods.toFind;
docSchema.statics.toFindAll = generalMethods.toFindAll;
docSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
docSchema.statics.toUpdate = generalMethods.toUpdate;
docSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
docSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
docSchema.statics.toRemove = generalMethods.toRemove;
docSchema.statics.toRemoveAll = generalMethods.toRemoveAll;
docSchema.statics.toFindOneAndUpdate =generalMethods.toFindOneAndUpdate;

let Doc = db.model("Doc", docSchema);
exports.Doc = Doc;

const matchedDocSchema = mongoose.Schema({
    username : String,
    docname : String,
    tomatchId : String,
    // helperName : String,
    // helperEmail : String,
    // helperPhone : String,
    // matchDir : String,
    isDeleted : {type : Boolean, default : false}
},{ timestamps : true});

matchedDocSchema.statics.toCreate = generalMethods.toCreate;
matchedDocSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
matchedDocSchema.statics.toFind = generalMethods.toFind;
matchedDocSchema.statics.toFindAll = generalMethods.toFindAll;
matchedDocSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
matchedDocSchema.statics.toUpdate = generalMethods.toUpdate;
matchedDocSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
matchedDocSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
matchedDocSchema.statics.toRemove = generalMethods.toRemove;
matchedDocSchema.statics.toRemoveAll = generalMethods.toRemoveAll;

let MatchedDoc = db.model("matchedDoc", matchedDocSchema);
exports.MatchedDoc = MatchedDoc;

const messageSchema = mongoose.Schema({
    // msgId : String,
    sender : String,
    receiver : String,
    content : String,
    sendDate : {type : Date, default: Date.now},
    isRead : {type : Boolean, default : false},
    ReadDate : Date,
    isDeleted : {type : Boolean, default : false}
},{ timestamps : true});

messageSchema.statics.toCreate = generalMethods.toCreate;
messageSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
messageSchema.statics.toInsertMany = generalMethods.toInsertMany;
messageSchema.statics.toFind = generalMethods.toFind;
messageSchema.statics.toFindAll = generalMethods.toFindAll;
messageSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
messageSchema.statics.toUpdate = generalMethods.toUpdate;
messageSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
messageSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
messageSchema.statics.toRemove = generalMethods.toRemove;
messageSchema.statics.toRemoveAll = generalMethods.toRemoveAll;
messageSchema.statics.toFindOneAndUpdate =generalMethods.toFindOneAndUpdate;



let Message = db.model("Message", messageSchema);
exports.Message = Message;

const photoSchema = mongoose.Schema({
   photoPath : String,
   username : String,
    docname : String,
    faceToken : String,
    faceLocation : Array,  //[left, top, width, height, photoWidth, photoHeight]
    isDeleted : {type : Boolean, default : false}
});

photoSchema.statics.toCreate = generalMethods.toCreate;
photoSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
photoSchema.statics.toInsertMany = generalMethods.toInsertMany;
photoSchema.statics.toFind = generalMethods.toFind;
photoSchema.statics.toFindAll = generalMethods.toFindAll;
photoSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
photoSchema.statics.toUpdate = generalMethods.toUpdate;
photoSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
photoSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
photoSchema.statics.toRemove = generalMethods.toRemove;
photoSchema.statics.toRemoveAll = generalMethods.toRemoveAll;

let Photo = db.model("Photo", photoSchema);
exports.Photo = Photo;



const tomatchSchema = mongoose.Schema({
    // photoName : String,
    photoPath : String,
    face : {type : Array, default : []},
    visitorId : String,    //也照片所在的目录名，sessionID
    username : {type : String, default : ""},
    createTime : {type : Date, default : Date.now},
    matchedPhoto : {type : Array, default : []}, //[[photo表里的photopath, facepath, score],]
    upperName : {type : String, default : ""},
    upperPhone : {type : String, default : ""},
    upperEmail : {type : String, default : ""},
    contactable : {type : Boolean, default : true},
    isVaild : {type : Boolean, default : true},
    isFinished : {type : Boolean, default : false},
    isDeleted : {type : Boolean, default : false}
});

tomatchSchema.statics.toCreate = generalMethods.toCreate;
tomatchSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
tomatchSchema.statics.toInsertMany = generalMethods.toInsertMany;
tomatchSchema.statics.toFind = generalMethods.toFind;
tomatchSchema.statics.toFindAll = generalMethods.toFindAll;
tomatchSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
tomatchSchema.statics.toUpdate = generalMethods.toUpdate;
tomatchSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
tomatchSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
tomatchSchema.statics.toRemove = generalMethods.toRemove;
tomatchSchema.statics.toRemoveAll = generalMethods.toRemoveAll;
tomatchSchema.statics.toFindOneAndUpdate =generalMethods.toFindOneAndUpdate;

let ToMatch = db.model("ToMatch", tomatchSchema);
exports.ToMatch = ToMatch;


const globalSchema = mongoose.Schema({ //总体，统计数据
    name : {type : String, default : "kface"},
    userQty : {type : Number, default : 0},
    docQty : {type : Number, default : 0},
    photoQty : {type : Number, default : 0},
    createTime : {type : Date, default : Date.now},
    isDeleted : {type : Boolean, default : false}
});

globalSchema.statics.toCreate = generalMethods.toCreate;
globalSchema.statics.toCreateWithOpt = generalMethods.toCreateWithOpt;
globalSchema.statics.toInsertMany = generalMethods.toInsertMany;
globalSchema.statics.toFind = generalMethods.toFind;
globalSchema.statics.toFindAll = generalMethods.toFindAll;
globalSchema.statics.toFindWithArgs = generalMethods.toFindWithArgs;
globalSchema.statics.toUpdate = generalMethods.toUpdate;
globalSchema.statics.toUpdateWithOpt= generalMethods.toUpdateWithOpt;
globalSchema.statics.toUpdateAll = generalMethods.toUpdateAll;
globalSchema.statics.toRemove = generalMethods.toRemove;
globalSchema.statics.toRemoveAll = generalMethods.toRemoveAll;
globalSchema.statics.toFindOneAndUpdate =generalMethods.toFindOneAndUpdate;

let Global = db.model("Global", globalSchema);
exports.Global = Global;
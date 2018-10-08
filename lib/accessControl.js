/* Practice by JERRY, created on 2018/10/8*/

const mongoose = require("mongoose");
acProset = require("acPreset");

class accessControl {
    constructor(db, conn){
        if (db = "mongoose") {
            let userSchema = mongoose.Schema({
                user: String, //使用用户名8个字符以上，管理用户名8个字符以下
                userGroup: String, //8个字符以下
                createTime: {type: Date, default: Date.now}
            });
            this.User = conn.model("User", userSchema);

            let roleSchema = mongoose.Schema({
                role: String,
                roleGroup: String,
                createTime: {type: Date, default: Date.now}
            });
            this.Role = conn.model("Role", roleSchema);

            let user_roleSchema = mongoose({
                user: String, //用户名或则用户组名，用户名优先
                role: String, //角色名或则角色组名，角色名优先
                createTime: {type: Date, default: Date.now}
            });
            this.UserRole = conn.model("UserRole", user_roleSchema);

            let resourceSchema = mongoose({
                resource: String,
                resourceGroup: String,
                dynamic: Boolean,
                container: Array,
                createTime: {type: Date, default: Date.now}
            });
            this.Resource = conn.model("Resource", resourceSchema);

            let process_resSchema = mongoose({
                process: String,
                parentProcess: String,
                preProcess: String,
                nextProcess: String,
                resource: String,
                role: String,
                operation: Number,
                createTime: {type: Date, default: Date.now}
            });
            this.ProcessRes = conn.model("ProcessRes", process_resSchema);

            //初始化，先判断是否已存在数据, 如果用户表为空则判定未初始化过
            //如果不存在，则导入预置数据acPreset.js
            (async function(){
                let doc = await this.User.find({});
                if (!doc){

                }

            });

        }



    }


}

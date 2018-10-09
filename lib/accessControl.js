/* Practice by JERRY, created on 2018/10/8*/

const mongoose = require("mongoose");

//定义操作的常量
//位运算，呈现1，左键点击2，右键点击4，中键点击8，中间滚动16，编辑32，拖动64
const operationCode ={
    SHOW : 0b1,
    LBUTTON : 0b10,
    RBUTTON : 0b100,
    MBUTTION : 0b1000,
    MWHEEL : 0b10000,
    EDIT : 0b100000
};
exports.OPTCode = operationCode;

class accessControl {
    constructor(db, conn, preset){
        if (db = "mongoose") {
            let userSchema = mongoose.Schema({
                user: String,
                userGroup: {type : String, default : () =>this.user},
                createTime: {type: Date, default: Date.now}
            });
            this.User = conn.model("User", userSchema);

            let roleSchema = mongoose.Schema({
                role: String,
                roleGroup: {type : String, default : () =>this.role},
                createTime: {type: Date, default: Date.now}
            });
            this.Role = conn.model("Role", roleSchema);

            let user_roleSchema = mongoose.Schema({
                user: String,
                userType : {type : String, default : "group"}, //用户名值为user, 用户组名用group
                role: String,
                roleType : {type : String, default : "group"},//角色名值为role, 角色组名用group
                createTime: {type: Date, default: Date.now}
            });
            this.UserRole = conn.model("UserRole", user_roleSchema);

            let resourceSchema = mongoose.Schema({
                resource : String,
                resourceKind : String,
                resourceGroup: {type : String, default : () =>this.resource},
                dynamic: Boolean,
                container: Array,
                createTime: {type: Date, default: Date.now}
            });
            this.Resource = conn.model("Resource", resourceSchema);

            let processSchema = mongoose.Schema({
                process : String,
                processType : String, //节点的值为node, 流程名的值为process
                dynamic : Boolean,
                parentProcess : String,
                preProcess: String,
                nextProcess: String
            });
            this.Process = conn.model("Process", processSchema);

            let ruleSchema = mongoose.Schema({
                rule: String,
                ruleType : {type : String, default : () =>this.rule},
                res : String,
                resType : String, //资源名值为resource, 资源组名值为group, 节点的值为node, 流程名的值为process
                operation: Number, //定义操作的常量表
                createTime: {type: Date, default: Date.now}
            });
            this.Rule = conn.model("Rule", accessSchema);

            let accessSchema = mongoose.Schema({
                rule : String,
                ruleType : String, //规则值为rule, 规则名值为group
                whitelist : {type : Boolean, default : "true"},
                role: String,
                roleType : String //角色名值为role, 角色组名用group
            });
            this.Access = conn.model("Access", accessSchema);

            //初始化，先判断是否已存在数据, 如果用户表为空则判定未初始化过
            //如果不存在，则导入预置数据acPreset.js
            (async function(){
                let doc = await this.User.find({});
                if (!doc){
                    //初始化，读取acPreset.js中的数据
                    let pset = require(preset);
                    for (let i=0, length = pset.user.length; i < length; i++ ){
                        await this.User.create(pset.user[i]);
                    }

                    for (let i=0, length = pset.role.length; i < length; i++ ){
                        await this.Role.create(pset.role[i]);
                    }

                    for (let i=0, length = pset.userRole.length; i < length; i++ ){
                        await this.UserRole.create(pset.userRole[i]);
                    }

                    for (let i=0, length = pset.resource.length; i < length; i++ ){
                        await this.Resource.create(pset.resource[i]);
                    }

                    for (let i=0, length = pset.process.length; i < length; i++ ){
                        await this.Process.create(pset.process[i]);
                    }

                    for (let i=0, length = pset.rule.length; i < length; i++ ){
                        await this.Rule.create(pset.rule[i]);
                    }

                    for (let i=0, length = pset.access.length; i < length; i++ ){
                        await this.Access.create(pset.access[i]);
                    }
                }

            });

            //上面的model已经包含常用的基本增删改查。
            // 可以添加其他各种数据组合操作方法


        }



    }


}

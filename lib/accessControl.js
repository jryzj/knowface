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
    constructor(db, conn, preset, prefix){
        this.prefix = prefix;
        this.DataSchema = ["user","operator","role","resource","rule","process"];  //固定的数据模型

        if (db == "mongoose") {
            let operatorSchema = mongoose.Schema({
                operator: String, //operator == 一对一 >>password
                password : String,
                createTime: {type: Date, default: Date.now}
            });
            this.Operator = conn.model(prefix + "Operator", operatorSchema);

            let operatorGroupSchema = mongoose.Schema({
                operator : String,    //operator == 多对多 >>operatorGroup
                operatorGroup: String,  //用户组名
                createTime: {type: Date, default: Date.now}
            });
            this.OperatorGroup = conn.model(prefix + "OperatorGroup", operatorGroupSchema);

            let roleSchema = mongoose.Schema({
                role: String,     //role == 多对多 >>roleGroup
                roleGroup: String,
                createTime: {type: Date, default: Date.now}
            });
            this.Role = conn.model(prefix + "Role", roleSchema);

            let userRoleSchema = mongoose.Schema({
                user: String,  //operator/operatorGroup == 多对多 >>role/roleGroup
                userType : String, //前端用户为user, 前端用户组为usergroup, 后端用户为operator, 用户组名用operatorgroup,
                role: String,
                roleType : {type : String, default : "group"},//角色名值为role, 角色组名用group
                createTime: {type: Date, default: Date.now}
            });
            this.UserRole = conn.model(prefix + "UserRole", userRoleSchema);

            let resourceSchema = mongoose.Schema({
                resource : String,    //resource == 一对多 >>resourceGroup
                exp : String, //动态资源的规则表达式
                resourceId : {type: String, default: Date.now},
                container: String,
                resourceKind : String,
                dynamic: Boolean, //true or false
                resourceGroup: String,
                createTime: {type: Date, default: Date.now}
            });
            this.Resource = conn.model(prefix + "Resource", resourceSchema);

            let processSchema = mongoose.Schema({
                process : String,
                processType : String, //节点的值为node, 流程名的值为process
                dynamic : Boolean,
                parentProcess : String,
                preProcess: String,
                nextProcess: String,
                resource : Array //[ {resource: String (resourceId 或group名)， resType : String (资源名值为resource, 资源组名值为group)}]
            });
            this.Process = conn.model(prefix + "Process", processSchema);

            let ruleSchema = mongoose.Schema({
                rule: String,
                ruleGroup : String,
                createTime: {type: Date, default: Date.now}
            });
            this.Rule = conn.model(prefix + "Rule", ruleSchema);

            let ruleProResSchema = mongoose.Schema({
                rule: String,
                ruleType : String, //rule or rulegroup
                proRes : String,
                proResType : String, //节点的值为node, 流程名的值为process,资源名值为resource, 资源组名值为group
                operation: Number, //定义操作的常量表
                createTime: {type: Date, default: Date.now}
            });
            this.RuleProRes = conn.model(prefix + "RuleProRes", ruleProResSchema);

            let accessSchema = mongoose.Schema({
                rule : String,
                ruleType : String, //规则值为rule, 规则名值为rulegroup
                whitelist : String, //whitelist or blacklist
                role: String,
                roleType : String //角色名值为role, 角色组名用rolegroup, 前端用户user，前端用户组usergroup, 用户组usergroup, 后端用户operator，用户组operatorgroup
            });
            this.Access = conn.model(prefix + "Access", accessSchema);

            let groupSchema = mongoose.Schema({
                dataSchema : String, //是上面那个数据模型的分组
                groupname : String, //分组名数组
                createTime: {type: Date, default: Date.now}
            });
            this.Group = conn.model(prefix + "Group", groupSchema);

            //初始化，先判断是否已存在数据, 如果用户表为空则判定未初始化过
            //如果不存在，则导入预置数据acPreset.js
            (async function(){
                let doc = await this.Operator.find({});
                console.log(doc);
                if (doc.length == 0){
                    //初始化，读取acPreset.js中的数据
                    let pset = require(preset);
                    if(pset.operator){
                    for (let i=0, length = pset.operator.length; i < length; i++ ){
                        await this.Operator.create(pset.operator[i]);
                    }}

                    if(pset.operatorGroup){
                    for (let i=0, length = pset.operatorGroup.length; i < length; i++ ){
                        await this.OperatorGroup.create(pset.operatorGroup[i]);
                    }}

                    if(pset.role){
                        for (let i=0, length = pset.role.length; i < length; i++ ){
                            await this.Role.create(pset.role[i]);
                        }
                    }

                    if(pset.userRole){
                        for (let i=0, length = pset.userRole.length; i < length; i++ ){
                            await this.UserRole.create(pset.userRole[i]);
                        }
                    }

                    if(pset.resource){
                        for (let i=0, length = pset.resource.length; i < length; i++ ){
                            await this.Resource.create(pset.resource[i]);
                        }
                    }

                    if(pset.process){
                        for (let i=0, length = pset.process.length; i < length; i++ ){
                            await this.Process.create(pset.process[i]);
                        }
                    }

                    if(pset.rule){
                    for (let i=0, length = pset.rule.length; i < length; i++ ){
                        await this.Rule.create(pset.rule[i]);
                    }}

                    if(pset.access){
                        for (let i=0, length = pset.access.length; i < length; i++ ){
                            await this.Access.create(pset.access[i]);
                        }
                    }

                    if(pset.group){
                        for (let i=0, length = pset.group.length; i < length; i++ ){
                            await this.Group.create(pset.group[i]);
                        }
                    }
                }

            }).call(this).catch(e => console.log(e));

            //上面的model已经包含常用的基本增删改查。
            // 可以添加其他各种数据操作方法


        }



    }

    test() {
        console.log("this is test for acesss control");
    }

    dataSchemaValid(schema) {
        return this.DataSchema.indexOf(schema)+1;
    }
}

exports.accessControl = accessControl;
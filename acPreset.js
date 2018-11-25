/* Practice by JERRY, created on 2018/10/8*/



let operator =[
    {operator : "admin"}
]; //json 数组
exports.operator = operator;

let operatorGroup =[
    {operator : "admin",
    operatorGroup: "admin"}
]; //json 数组
exports.operatorGroup = operatorGroup;


let role = [
    {role : "admin",
    roleGroup : "admin"}
];
exports.role = role;

let userRole = [
    {user : "admin",
    role : "admin"}
];
exports.userRole = userRole;

let resource = [
    {
        resource: "/admin",
        resourceKind : "url",
        resourceGroup: "admin",
        dynamic: false,
        container: "",
    }
];
exports.resource = resource;

let process =[{

}];
exports.process = process;

let access =[{
    rule : "admin",
    ruleType : "group",
    whitelist : "true",
    role: "admin",
    roleType : "group"
}];
exports.access = access;

let group = [
    {
      dataSchema : "user",
      groupname : "user"
    },
    {
        dataSchema :"operator",
        groupname : "admin"
    },
    {
        dataSchema :"role",
        groupname :"admin"
    },
    {
        dataSchema :"resource",
        groupname : "admin"
    },
    {
        dataSchema :"process",
        groupname : "node"
    },
    {
        dataSchema :"rule",
        groupname :"admin"
    }
];
exports.group = group;
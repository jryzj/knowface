/* Practice by JERRY, created on 2018/10/8*/



let user =[
    {user : "admin"}
]; //json 数组
exports.user = user;

let role = [
    {role : "admin"}
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
        container: [],
    }
];
exports.resource = resource;

let process =[{

}];
exports.process = process;

let rule =[{
    rule: "admin",
    res : "admin",
    resType : "group",
    operation: 0b1
}];
exports.rule = rule;

let access =[{
    rule : "admin",
    ruleType : "group",
    whitelist : "true",
    role: "admin",
    roleType : "group"
}];
exports.access = access;


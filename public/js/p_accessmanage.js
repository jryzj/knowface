/* Practice by JERRY, created on 2018/10/10*/
$(function () {
    let groupGrid, operatorGrid, operatorGroupGrid, roleGrid, resourceGrid, ruleGrid, processList = [], ruleList = [],
        userRoleList = [],
        accessList = [];
    let groupName = [], operatorGroupName=[], roleGroupName = [], resourceGroupName = [], ruleTypeName = [];
    let operatorData = [], operatorGroupData = [], roleData = [], resourceData = [], ruleData = [];
    let groupChanged = {};
    // let groupSkip = 0, groupLimit = 10;
    jsGrid.locale("zh-cn");

    //operator表
    if (!operatorGrid) {
        operatorGrid = $("#p_accessmanage_table_operator").jsGrid({
            width: "100%",
            inserting: true,
            filtering: true,
            editing: true,
            sorting: true,
            paging: true,
            // data: data,
            autoload: true,
            fields: [
                {name: "_id", type: "text", visible: false},
                {name: "operator", type: "text", title: "操作员名", editing: false},
                {
                    name: "password", type: "text", title: "密码", sorting: false, filtering: false,
                    itemTemplate: function (value) {
                        return "********";
                    }
                },
                {type: "control"}
            ],
            onItemInserting: function (args) {
                console.log("before item insert");
                console.log(args.item);
                let message = ``;
                let reg = /^[a-zA-Z0-9_-]{8,32}$/;  //用户名正则，8到32位（字母，数字，下划线，减号）
                if (!reg.test(args.item.operator)) {
                    message += `*用户名不符合规则，必须是8到32个字符组成，字符为英文字母大小写、数字、下划线、中划线。\n\r`;
                }

                reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; //密码强度正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符

                if (!reg.test(args.item.password)) {
                    message += `*密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。\n\r`;
                }

                if (message.length > 0) {
                    args.cancel = true;
                    alert(message);
                }

            },
            onItemInserted: function (args) {
                console.log("after item insert");
            },
            onItemDeleting: function (args) {
                console.log("before item deleted");
                console.log(args);
                return $.ajax({
                    url: "/admin/access/operator",
                    data: args.item,
                    type: "DELETE",
                    async: false,
                    success: function (result) {
                        if (result != "ok") {
                            args.cancel = true;
                            alert(result);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        args.cancel = true;
                        alert("删除出错，请重试！")
                    }
                });
            },
            onItemUpdating: function (args) {
                console.log(args);
                if (JSON.stringify(args.item) == JSON.stringify(args.previousItem)) {
                    args.cancel = true;
                    alert("数据没有变化！")
                }
            },
            controller: {
                loadData: function (filter) {
                    if (operatorData.length == 0) {
                        console.log(this);
                        console.log("loadData");
                        console.log(filter);
                        return $.ajax({
                            url: "/admin/access/operator",
                            type: "GET",
                            success: function (result) {
                                if (result != "error") {
                                    operatorData = $.extend(true, [], result);
                                    console.log(operatorData);
                                }
                            },
                            error: function (err) {
                                alert("数据请求发生错误，请重试！");
                            }
                        });
                    } else {
                        console.log(filter);
                        let def = $.Deferred();
                        for (let i = 0, length = operatorData.length; i < length; i++) {
                            if (operatorData[i].operator == filter.operator) {
                                return [operatorData[i]];
                            }
                        }
                        def.resolve([]);
                    }
                },
                insertItem: function (item) {
                    let def = $.Deferred();
                    $.ajax({
                        url: "/admin/access/operator",
                        type: "POST",
                        data: item,
                        success: function (result) {
                            if (result.state == "ok") {
                                console.log("post ok");
                                item._id = result.result._id;
                                def.resolve();
                            } else {
                                console.log(result.result);
                                alert(result.result);
                                def.reject();
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("数据请求发生错误，请重试！");
                            def.reject();
                        }
                    });
                    return def;
                },
                updateItem: function (item) {
                    let def = $.Deferred();
                    $.ajax({
                        url: "/admin/access/operator",
                        type: "PUT",
                        data: item,
                        success: function (result) {
                            if (result.state == "ok") {
                                def.resolve();
                                console.log(result);
                            } else {
                                alert(result.result);
                                def.reject();
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("数据请求发生错误，请重试！");
                            def.reject();
                        }
                    });
                    return def;
                },
                deleteItem: function (item) {
                    let def = $.Deferred();
                    $.ajax({
                        url: "/admin/access/operator",
                        type: "DELETE",
                        data: item,
                        success: function (result) {
                            if (result == "ok") {
                                def.resolve();
                                console.log(result);
                            } else {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("数据请求发生错误，请重试！");
                            def.reject();
                        }
                    });
                    return def;
                }
            }
        });
    }

    //operator分组表
    $("#p_accessmanage_nav-operatorgroup-tab").click(function(){
        console.log("operator group");
        if (!operatorGroupGrid || groupChanged.operator) {
        operatorGroupGrid = $("#p_accessmanage_table_operatorgroup").jsGrid({
            width: "100%",
            inserting: true,
            filtering: true,
            editing: true,
            sorting: true,
            paging: true,
            // data: [{_id: "sdfdasf", operator : "adfa", operatorGroup : "group"}],
            autoload: true,
            fields: [
                {name: "_id", type: "text", visible: false},
                {name: "operator", type: "text", title: "操作员名", editing: false},
                {name: "operatorGroup", type: "text", title: "分组名",
                    insertTemplate: function (value) {
                        console.log("insertTemplate");
                        if(operatorGroupName.length){
                            let select = "";
                            for (let i = 0, length = operatorGroupName.length; i < length; i++) {
                                select += "<option value=" + operatorGroupName[i] + ">" + operatorGroupName[i] + "</option>";
                            }
                            select = "<select name='operatorGroup' id='operatorgroup_inserttemp'>" +select + "</select>";

                            return select;
                        }
                    },
                    insertValue: function () {
                        console.log(this);
                        return $("#operatorgroup_inserttemp").val();
                    },
                    editTemplate: function(value, item) {
                        console.log(value, item);
                        console.log("editTemplate");
                        if(operatorGroupName.length){
                            let select = "";
                            for (let i = 0, length = operatorGroupName.length; i < length; i++) {
                                if(value == operatorGroupName[i])
                                    select += "<option value=" + operatorGroupName[i] + " selected = 'selected'>" + operatorGroupName[i] + "</option>";
                                else
                                    select += "<option value=" + operatorGroupName[i] + ">" + operatorGroupName[i] + "</option>";
                            }
                            select = "<select name='operatorGroup' id='operatorgroup_edittemp'>" +select + "</select>";

                            return select;
                        }

                    },
                    editValue : function () {
                        console.log($("#operatorgroup_edittemp").val());
                        return $("#operatorgroup_edittemp").val();
                    }

                    },
                {type: "control"}
            ],
            controller: {
                loadData: function (filter) {
                    console.log("loadData");
                    let def = $.Deferred();
                    let grid = $("#p_accessmanage_table_operatorgroup").data("JSGrid");
                    console.log(grid.data);
                    if (!grid.data.length || groupChanged.operator) {
                        console.log(this); //这里的this就是controller对象本身
                        console.log(filter);
                        $.ajax({
                            url: "/admin/access/operatorGroup",
                            type: "GET",
                            success: function (result) {
                                if (result.state != "error") {
                                    operatorGroupName = result.groupname;
                                    groupChanged.operator = false;
                                    $.extend(true, operatorGroupData, result.result);
                                    console.log(result);
                                    def.resolve(result.result);
                                }
                            },
                            error: function (err) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    } else {
                        console.log("filter",filter);
                        let matched = [];
                        for (let i = 0, length = operatorGroupData.length; i < length; i++) {
                            let tag = 1;
                            for (let key in filter) {
                                if (filter[key] !== "") {
                                    if (filter[key] !== operatorGroupData[i][key]) {
                                        tag = 0;
                                    }
                                }
                            }
                            if (tag) matched.push(operatorGroupData[i]);
                        }
                        return matched;
                    }
                },
            insertItem: function (item) {
                let def = $.Deferred();
                $.ajax({
                    url: "/admin/access/operatorGroup",
                    type: "POST",
                    data: item,
                    success: function (result) {
                        if (result.state == "ok") {
                            console.log("post ok");
                            item._id = result.result._id;
                            operatorGroupData.push(item);  //if insert successfully, update local buffer.
                            def.resolve();
                        } else {
                            console.log(result.result);
                            alert(result.result);
                            def.reject();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("数据请求发生错误，请重试！");
                        def.reject();
                    }
                });
                return def;
            },
            updateItem: function (item) {
                console.log(item);
                let def = $.Deferred();
                $.ajax({
                    url: "/admin/access/operatorGroup",
                    type: "PUT",
                    data: item,
                    success: function (result) {
                        if (result.state == "ok") {
                            for (let i = 0, length = operatorGroupData.length; i < length; i++) {
                                if(operatorGroupData[i]._id == item._id){
                                    operatorGroupData[i].operator = item.operator;
                                    operatorGroupData[i].operatorGroup = item.operatorGroup;
                                }
                            }
                            def.resolve();
                            console.log(result);
                        } else {
                            alert(result.result);
                            def.reject();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("数据请求发生错误，请重试！");
                        def.reject();
                    }
                });
                return def;
            },
            deleteItem: function (item) {
                let def = $.Deferred();
                $.ajax({
                    url: "/admin/access/operatorGroup",
                    type: "DELETE",
                    data: item,
                    success: function (result) {
                        if (result.state == "ok") {
                            for (let i = 0, length = operatorGroupData.length, l = length-1; i < length; i++) {
                                if(operatorGroupData[i]._id == item._id) {
                                    if (i != l) {
                                        operatorGroupData[i] = operatorGroupData[l];
                                        i = length;
                                    }
                                    operatorGroupData.pop();
                                }
                            }
                            def.resolve();
                            console.log(result);
                        } else {
                            alert("数据请求发生错误，请重试！");
                            def.reject();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("数据请求发生错误，请重试！");
                        def.reject();
                    }
                });
                return def;
            }
        },
            onDataLoaded : function(args){
                console.log("onDataLoad");
                console.log(this);
                console.log(operatorGroupGrid);
                let grid = $("#p_accessmanage_table_operatorgroup").data("JSGrid");
                this._renderGrid();

/*                                    let select = "";
                                    for (let i = 0, length = operatorGroupName.length; i < length; i++) {
                                        select += "<option value=" + operatorGroupName[i] + ">" + operatorGroupName[i] + "</option>";
                                    }
                                    select = "<select name='operatorGroup'>" +select + "</select>";

                                    $($("#p_accessmanage_table_operatorgroup .jsgrid-insert-row td").get(1)).html(select);*/

            }

        });
    }
});

    //role分组表
    $("#p_accessmanage_nav-role-tab").click(function(){
        console.log("role group");
        if (!roleGrid || groupChanged.role) {
            roleGrid = $("#p_accessmanage_table_role").jsGrid({
                width: "100%",
                inserting: true,
                filtering: true,
                editing: true,
                sorting: true,
                paging: true,
                autoload: true,
                fields: [
                    {name: "_id", type: "text", visible: false},
                    {name: "role", type: "text", title: "角色名", editing: false},
                    {name: "roleGroup", type: "text", title: "分组名",
                        insertTemplate: function (value) {
                            console.log("insertTemplate");
                            if(roleGroupName.length){
                                let select = "";
                                for (let i = 0, length = roleGroupName.length; i < length; i++) {
                                    select += "<option value=" + roleGroupName[i] + ">" + roleGroupName[i] + "</option>";
                                }
                                select = "<select name='roleGroup' id='rolegroup_inserttemp'>" +select + "</select>";

                                return select;
                            }
                        },
                        insertValue: function () {
                            console.log(this);
                            return $("#rolegroup_inserttemp").val();
                        },
                        editTemplate: function(value, item) {
                            console.log(value, item);
                            console.log("editTemplate");
                            if(roleGroupName.length){
                                let select = "";
                                for (let i = 0, length = roleGroupName.length; i < length; i++) {
                                    if(value == roleGroupName[i])
                                        select += "<option value=" + roleGroupName[i] + " selected = 'selected'>" + roleGroupName[i] + "</option>";
                                    else
                                        select += "<option value=" + roleGroupName[i] + ">" + roleGroupName[i] + "</option>";
                                }
                                select = "<select name='roleGroup' id='rolegroup_edittemp'>" +select + "</select>";

                                return select;
                            }

                        },
                        editValue : function () {
                            return $("#rolegroup_edittemp").val();
                        }

                    },
                    {type: "control"}
                ],
                controller: {
                    loadData: function (filter) {
                        console.log("role loadData");
                        let def = $.Deferred();
                        let grid = $("#p_accessmanage_table_role").data("JSGrid");
                        console.log(grid.data);
                        if (!grid.data.length  || groupChanged.role) {
                            console.log(this); //这里的this就是controller对象本身
                            console.log(filter);
                            $.ajax({
                                url: "/admin/access/role",
                                type: "GET",
                                success: function (result) {
                                    if (result.state != "error") {
                                        roleGroupName = result.groupname;
                                        groupChanged.role = false;
                                        $.extend(true, roleData, result.result);
                                        console.log(result);
                                        def.resolve(result.result);
                                    }
                                },
                                error: function (err) {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            });
                            return def;
                        } else {
                            console.log("filter",filter);
                            let matched = [];
                            for (let i = 0, length = roleData.length; i < length; i++) {
                                let tag = 1;
                                for (let key in filter) {
                                    if (filter[key] !== "") {
                                        if (filter[key] !== roleData[i][key]) {
                                            tag = 0;
                                        }
                                    }
                                }
                                if (tag) matched.push(roleData[i]);
                            }
                            return matched;
                        }
                    },
                    insertItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/role",
                            type: "POST",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    console.log("post ok");
                                    item._id = result.result._id;
                                    roleData.push(item);  //if insert successfully, update local buffer.
                                    def.resolve(item);
                                } else {
                                    console.log(result.result);
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    updateItem: function (item) {
                        console.log(item);
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/role",
                            type: "PUT",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = roleData.length; i < length; i++) {
                                        if(roleData[i]._id == item._id){
                                            roleData[i].operator = item.operator;
                                            roleData[i].operatorGroup = item.operatorGroup;
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    deleteItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/role",
                            type: "DELETE",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = roleData.length, l = length-1; i < length; i++) {
                                        if(roleData[i]._id == item._id) {
                                            if (i != l) {
                                                roleData[i]._id = roleData[l]._id;
                                                roleData[i].operator = roleData[l].operator;
                                                roleData[i].operatorGroup = roleData[l].operatorGroup;
                                            }
                                            roleData.pop();
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    }
                },
                onDataLoaded : function(args){
                    console.log("onDataLoad");
                    console.log(this);
                    console.log(roleGrid);
                    // let grid = $("#p_accessmanage_table_role").data("JSGrid");
                    this._renderGrid();
                }

            });
        }
    });

    //resource分组
    $("#p_accessmanage_nav-resource-tab").click(function(){
        console.log("resource group");
        if (!resourceGrid || groupChanged.resource) {
            roleGrid = $("#p_accessmanage_table_resource").jsGrid({
                width: "100%",
                inserting: true,
                filtering: true,
                editing: true,
                sorting: true,
                paging: true,
                autoload: true,
                fields: [
                    {name: "_id", type: "text", visible: false},
                    {name: "resource", type: "text", title: "资源内容", editing: false,validate: "required"},
                    {name: "exp", type: "text", title: "动态规则", editing: false},
                    {name: "resourceId", type: "text", title: "资源Id", inserting: false, editing: false},
                    {name: "resourceKind", type: "text", title: "资源类型", editing: false},
                    {name: "dynamic", type: "select", title: "动态与否", editing: false
                        , items : [{name : "", value : ""}, {name : "否", value : false}, {name : "是", value : true}], textField : "name", valueField : "value"
                        ,validate: "required"},
                    {name: "containerId", type: "text", title: "容器内容Id", editing: false},
                    {name: "resourceGroup", type: "select", title: "分组名", items : [{name : ""}],  textField : "name", valueField : "name", validate: "required"
                        /*,
                        insertTemplate: function (value) {
                            console.log("insertTemplate");
                            if(resourceGroupName.length){
                                let select = "";
                                for (let i = 0, length = resourceGroupName.length; i < length; i++) {
                                    select += "<option value=" + resourceGroupName[i] + ">" + resourceGroupName[i] + "</option>";
                                }
                                select = "<select name='resourceGroup' id='resourcegroup_inserttemp'>" +select + "</select>";

                                return select;
                            }
                        },
                        insertValue: function () {
                            console.log(this);
                            return $("#resourcegroup_inserttemp").val();
                        },
                        editTemplate: function(value, item) {
                            console.log(value, item);
                            console.log("editTemplate");
                            if(resourceGroupName.length){
                                let select = "";
                                for (let i = 0, length = resourceGroupName.length; i < length; i++) {
                                    if(value == resourceGroupName[i])
                                        select += "<option value=" + resourceGroupName[i] + " selected = 'selected'>" + resourceGroupName[i] + "</option>";
                                    else
                                        select += "<option value=" + resourceGroupName[i] + ">" + resourceGroupName[i] + "</option>";
                                }
                                select = "<select name='resourceGroup' id='resourcegroup_edittemp'>" +select + "</select>";

                                return select;
                            }

                        },
                        editValue : function () {
                            return $("#resourcegroup_edittemp").val();
                        }*/

                    },
                    {type: "control"}
                ],
                controller: {
                    loadData: function (filter) {
                        console.log("resource loadData");
                        let def = $.Deferred();
                        let grid = $("#p_accessmanage_table_resource").data("JSGrid");
                        console.log(grid.data);
                        if (!grid.data.length  || groupChanged.resource) {
                            console.log(this); //这里的this就是controller对象本身
                            console.log(filter);
                            $.ajax({
                                url: "/admin/access/resource",
                                type: "GET",
                                success: function (result) {
                                    if (result.state != "error") {
                                        resourceGroupName = result.groupname;
                                        groupChanged.role = false;
                                        $.extend(true, resourceData, result.result);
                                        console.log(result);
                                        def.resolve(result.result);
                                    }
                                },
                                error: function (err) {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            });
                            return def;
                        } else {
                            console.log("filter",filter);
                            let matched = [];
                            for (let i = 0, length = resourceData.length; i < length; i++) {
                                let tag = 1;
                                for (let key in filter) {
                                    if (filter[key] !== "") {
                                        if (filter[key] !== resourceData[i][key]) {
                                            tag = 0;
                                        }
                                    }
                                }
                                if (tag) matched.push(resourceData[i]);
                            }
                            return matched;
                        }
                    },
                    insertItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/resource",
                            type: "POST",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    console.log("post ok");
                                    item._id = result.result._id;
                                    resourceData.push(item);  //if insert successfully, update local buffer.
                                    def.resolve(item);
                                } else {
                                    console.log(result.result);
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    updateItem: function (item) {
                        console.log(item);
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/resource",
                            type: "PUT",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = resourceData.length; i < length; i++) {
                                        if(resourceData[i]._id == item._id){
                                            resourceData[i] = item;
                                            i = length;
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    deleteItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/resource",
                            type: "DELETE",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = resourceData.length, l = length-1; i < length; i++) {
                                        if(resourceData[i]._id == item._id) {
                                            if (i != l) {
                                                resourceData[i] = resourceData[l];
                                                i = length;
                                            }
                                            resourceData.pop();
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    }
                },
                onDataLoaded : function(args){
                    console.log("onDataLoad");
                    console.log(this);
                    console.log(resourceGrid);
                    // let grid = $("#p_accessmanage_table_role").data("JSGrid");
                    let items =[{name : ""}];
                    for (let i = 0, length = resourceGroupName.length; i < length; i++){
                        let item = {name : resourceGroupName[i]};
                        items.push(item);
                    }
                    this.fields[7].items = items;
                    this._renderGrid();
                }

            });
        }
    });

    $("#p_accessmanage_nav-rule-tab").click(function(){
        console.log("rule group");
        if (!ruleGrid || groupChanged.rule) {
            roleGrid = $("#p_accessmanage_table_rule").jsGrid({
                width: "100%",
                inserting: true,
                filtering: true,
                editing: true,
                sorting: true,
                paging: true,
                autoload: true,
                fields: [
                    {name: "_id", type: "text", visible: false},
                    {name: "rule", type: "text", title: "权限名", editing: false, validate: "required"},
                    {name: "ruleType", type: "select", title: "权限类型", editing: false, items : [{name : ""}]
                        ,textField : "name", valueField : "name", validate: "required"},
                    {name: "proRes", type: "text", title: "流程或资源", editing: false, validate: "required"},
                    {name: "proResType", type: "select", title: "流程或资源类型", editing: false
                        , items : [{name : ""},{name : "resource"},{name : "group"},{name : "node"},{name : "process"}]
                        ,textField : "name", valueField : "name", validate: "required"},
                    {name: "operation", type: "number", title: "操作代码", validate: "required"},
                    {type: "control"}
                ],
                controller: {
                    loadData: function (filter) {
                        console.log("rule loadData");
                        let def = $.Deferred();
                        let grid = $("#p_accessmanage_table_rule").data("JSGrid");
                        console.log(grid.data);
                        if (!grid.data.length  || groupChanged.rule) {
                            console.log(this); //这里的this就是controller对象本身
                            console.log(filter);
                            $.ajax({
                                url: "/admin/access/rule",
                                type: "GET",
                                success: function (result) {
                                    if (result.state != "error") {
                                        ruleTypeName = result.groupname;
                                        groupChanged.rule = false;
                                        $.extend(true, ruleData, result.result);
                                        console.log(result);
                                        def.resolve(result.result);
                                    }
                                },
                                error: function (err) {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            });
                            return def;
                        } else {
                            console.log("filter",filter);
                            let matched = [];
                            for (let i = 0, length = ruleData.length; i < length; i++) {
                                let tag = 1;
                                for (let key in filter) {
                                    if (filter[key] !== "" && filter[key] !== undefined) {
                                        if (filter[key] !== ruleData[i][key]) {
                                            tag = 0;
                                        }
                                    }
                                }
                                if (tag) matched.push(ruleData[i]);
                            }
                            return matched;
                        }
                    },
                    insertItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/rule",
                            type: "POST",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    console.log("post ok");
                                    item._id = result.result._id;
                                    ruleData.push(item);  //if insert successfully, update local buffer.
                                    def.resolve(item);
                                } else {
                                    console.log(result.result);
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    updateItem: function (item) {
                        console.log(item);
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/rule",
                            type: "PUT",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = ruleData.length; i < length; i++) {
                                        if(ruleData[i]._id == item._id){
                                            ruleData[i] = item;
                                            i = length;
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert(result.result);
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    },
                    deleteItem: function (item) {
                        let def = $.Deferred();
                        $.ajax({
                            url: "/admin/access/rule",
                            type: "DELETE",
                            data: item,
                            success: function (result) {
                                if (result.state == "ok") {
                                    for (let i = 0, length = ruleData.length, l = length-1; i < length; i++) {
                                        if(ruleData[i]._id == item._id) {
                                            if (i != l) {
                                                ruleData[i] = ruleData[l];
                                                i = length;
                                            }
                                            ruleData.pop();
                                        }
                                    }
                                    def.resolve();
                                    console.log(result);
                                } else {
                                    alert("数据请求发生错误，请重试！");
                                    def.reject();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    }
                },
                onDataLoaded : function(args){
                    console.log("onDataLoad");
                    console.log(this);
                    console.log(ruleGrid);
                    // let grid = $("#p_accessmanage_table_role").data("JSGrid");
                    let items =[{name : ""}];
                    console.log(ruleTypeName);
                    for (let i = 0, length = ruleTypeName.length; i < length; i++){
                        let item = {name : ruleTypeName[i]};
                        items.push(item);
                    }
                    this.fields[2].items = items;
                    this._renderGrid();
                }

            });
        }
    });


    //分组定义表
    $("#p_accessmanage_nav-group-tab").click(function () {
        if (!groupGrid) {
            //向服务器请求数据, 用户dataTable
            /*            $.get( "/admin/access/ask_group", {groupSkip : groupSkip, groupLimit : groupLimit}, function (result) {
                                alert(result);
                            })*/

            /*
                            let tbGroup = $("#p_accessmanage_table_id_group").DataTable({
                                // "info" : false,
                                language : { url : "../txt/dataTable_cn.txt"},
                                paging : true,
                                processing : true,
                                columns : [
                                    {data : "id", visible : false},
                                    {data : "dataSchema"},
                                    {data : "name"}
                                ],
                                buttons: ["csv","copy"],
                                dom : "lBfrtip",
                                serverSide : false,
                                ajax : {
                                    url : "/admin/access/ask_group",
                                    type : "GET"
                                },
                                createdRow: function (row, data, index) { //表格的dom建立完成后，在JQuery中加入数据库表中的id数据。
                                    // row : tr dom
                                    // data: row data
                                    // index:row data's index
                                    $(row).data("dbid",data.id);
                                },
                                initComplete : function(setting, json){ //表格渲染完后，绑定事件。
                                    $("tbody>tr").click(function(){
                                        alert($(this).data("dbid"));
                                    })

                                    new $.fn.dataTable.Buttons( tbGroup, {
                                        buttons: [
                                            'copy', 'excel', 'pdf'
                                        ]
                                    } );

                                }

                            });
            */
            $.get("/admin/access/group", function (data) {
                console.log(data);
                groupName = data.groupname;
                groupGrid = $("#p_accessmanage_table_group").jsGrid({
                    width: "100%",
                    inserting: true,
                    // filtering : true,
                    // editing: false,
                    sorting: true,
                    paging: true,
                    data: data.data,
                    fields: [
                        {name: "_id", type: "text", visible: false},
                        {name: "groupname", type: "text", title: "分组名称"},
                        {
                            name: "dataSchema", type: "text", title: "数据模型"
                            ,
                            insertTemplate: function (value) {
                                let select = "";
                                for (let i = 0, length = groupName.length; i < length; i++) {
                                    select += "<option value=" + groupName[i] + ">" + groupName[i] + "</option>";
                                }
                                return $("<select name='dataSchema'>").append(select);
                            },
                            insertValue: function () {
                                console.log(this);
                                return $("select[name='dataSchema']").val();
                            }
                        },
                        {type: "control",
/*                            itemTemplate: function(value, item) {
                                var $result = $([]);

                                if(this.editButton) {
                                    // $result = $result.add(this._createEditButton(item));
                                }

                                if(this.deleteButton) {
                                    $result = $result.add(this._createDeleteButton(item));
                                }

                                return $result;
                            }*/
                            editButton : false
                        }
                    ],
                    onItemInserting: function (args) {
                        console.log("before item insert");
                        console.log(args.item);
                        if (args.item.name == "" || args.item.dataSchema == "") {
                            args.cancel = true;
                            alert("请填写完整内容！");
                        } else {
                            return $.ajax({
                                url: "/admin/access/group",
                                data: args.item,
                                type: "POST",
                                async: false,
                                success: function (result) {
                                    if (result.state != "ok") {
                                        args.cancel = true;
                                        alert(result.result);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    args.cancel = true;
                                    alert("保存出错，请重试！")
                                }
                            });
                        }
                    },
                    onItemInserted: function (args) {
                        groupChanged[args.item.dataSchema] = true;
                        console.log("after item insert");

                    },
                    onItemDeleting: function (args) {
                        console.log("before item deleted");
                        return $.ajax({
                            url: "/admin/access/group",
                            data: args.item,
                            type: "DELETE",
                            async: false,
                            success: function (result) {
                                if (result.state != "ok") {
                                    args.cancel = true;
                                    alert(result.result);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                args.cancel = true;
                                alert("删除出错，请重试！")
                            }
                        });


                    },
                    onItemDeleted: function (args) {
                        groupChanged[args.item.dataSchema] = true;
                        console.log("after item insert");

                    },
                    controller: {}
                });

            })


        }
    })


});

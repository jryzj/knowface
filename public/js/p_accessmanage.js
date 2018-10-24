/* Practice by JERRY, created on 2018/10/10*/
$(function () {
    let groupGrid, operatorGrid, operatorGroupGrid, roleGrid, resourceList = [], processList = [], ruleList = [],
        userRoleList = [],
        accessList = [];
    let groupname = [];
    let operatorData = [], operatorGroupData = [];
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
        console.log("dfgsdf");
        if (!operatorGroupGrid) {
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
                {name: "operatorGroup", type: "text", title: "分组名"},
                {type: "control"}
            ],
            controller: {
                loadData: function (filter) {
                    console.log("loadData");
                    let def = $.Deferred();
                    if (operatorGroupData.length == 0) {
                        console.log(this);
                        console.log(filter);
                        $.ajax({
                            url: "/admin/access/operatorGroup",
                            type: "GET",
                            success: function (result) {
                                if (result.state != "error") {
                                    operatorGroupData = $.extend(true, {}, result);
                                    console.log(operatorGroupData);
                                    def.resolve(result.data);
                                }
                            },
                            error: function (err) {
                                alert("数据请求发生错误，请重试！");
                                def.reject();
                            }
                        });
                        return def;
                    } else {
                        console.log(filter);
                        for (let i = 0, length = operatorGroupData.data.length; i < length; i++) {
                            let tag = 1;
                            for (key in filter) {
                                if (filter.key != "") {
                                    if (filter.key != operatorGroupData.data[i].key) {
                                        tag = 0;
                                    }
                                }
                            }
                            if (tag) return [operatorGroupData.data[i]];
                        }
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
                let groupname = data.groupname;
                groupGrid = $("#p_accessmanage_table_group").jsGrid({
                    width: "100%",
                    inserting: true,
                    // filtering : true,
                    // editing: false,
                    sorting: true,
                    paging: true,
                    data: data.data,
                    fields: [
                        {name: "id", type: "text", visible: false},
                        {name: "name", type: "text", title: "分组名称"},
                        {
                            name: "dataSchema", type: "text", title: "数据模型"
                            ,
                            insertTemplate: function (value) {
                                let select = "";
                                for (let i = 0, length = groupname.length; i < length; i++) {
                                    select += "<option value=" + groupname[i] + ">" + groupname[i] + "</option>";
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
                    controller: {}
                });

            })


        }
    })


});

/* Practice by JERRY, created on 2018/10/10*/
$(function(){
    let groupGrid, userList=[], roleList=[], resourceList=[], processList=[], ruleList=[], userRoleList=[], accessList=[];
    let groupname=[];
    // let groupSkip = 0, groupLimit = 10;


    //分组定义表
    $("#p_accessmanage_nav-group-tab").click(function(){
        if(!groupGrid){
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
                $.get("/admin/access/group",function(data){
                    console.log(data);
                    let groupname = data.groupname;
                    groupGrid = $("#p_accessmanage_table_group").jsGrid({
                        width: "100%",
                        inserting: true,
                        // filtering : true,
                        editing: true,
                        sorting: true,
                        paging: true,
                        data : data.data,
                        fields : [
                            { name: "id", type: "text", visible : false},
                            { name: "name", type: "text", title : "分组名称"},
                            { name: "dataSchema", type: "text", title : "数据模型"
                                ,
                                insertTemplate: function(value) {
                                    let select = "";
                                    for (let i = 0 , length = groupname.length; i < length; i++){
                                        select += "<option value=" + groupname[i] + ">" + groupname[i] + "</option>";
                                    }
                                    return $("<select name='dataSchema'>").append(select);
                                },
                                insertValue: function() {
                                    console.log(this);
                                    return $("select[name='dataSchema']").val();
                                }
                                },
                            { type: "control" }
                        ],
                        onItemInserting: function(args) {
                            console.log("before item insert");
                            console.log(args.item);
                            if(args.item.name == "" || args.item.dataSchema ==""){
                                args.cancel = true;
                                alert("请填写完整内容！");
                            }else {
                                return $.ajax({
                                    url: "/admin/access/group",
                                    data: args.item,
                                    type: "POST",
                                    async : false,
                                    success: function (result) {
                                        if (result != "ok") {
                                            args.cancel = true;
                                            alert(result);
                                        }
                                    }
                                });
                            }
                        },
                        onItemInserted: function(args) {
                            console.log("after item insert");

                        },
                        onItemDeleting : function(args){
                            console.log("before item deleted");

                    },
                        controller : {

                        }
                    });
                    jsGrid().locale("zh-cn");
                })


        }
    })





});

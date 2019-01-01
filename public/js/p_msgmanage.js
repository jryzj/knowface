/* Practice by JERRY, created on 2018/12/28*/
$(function(){
    let timer;
    let item;
    const READTIME = 2000;

    $("#p_msgmanage_jsgrid_msg").jsGrid({
        width: "100%",
        height: "auto",

        filtering: true,
        selecting: true,
        sorting: true,
        paging: true,
        // pageLoading: true,
        data : [],

        pageSize : 5,

        autoload : true,

        fields : [
            {id : "_id", type : "text", visible : false}
            ,{name : "sendDate", type : "text", title : "收到时间"
                ,itemTemplate : function (value, item) {
                    return new Date(value).toLocaleString();
                } }
            ,{name : "sender", type : "text", title : "发送人" }
            ,{name : "content", type : "text", title : "内容"}
            ,{name : "isRead", type : "text", title : "是否已读"
                ,itemTemplate : function(value, item){
                    return value?"已读":"未读";
    }}
            ,{type : "control",  editButton: false}
        ],

        controller : {
            loadData : function(filter){
                if (filter.isRead == "已读")
                    filter.isRead = true;
                else if (filter.isRead == false)
                    filter.isRead = false;
                else
                    delete filter.isRead;

                for (let field in filter){
                    if (filter[field] == "") delete filter[field];
                }
                    return $.ajax({
                        url : "/admin/msgcrud",
                        type : "GET",
                        data : filter
                    })
            },
            deleteItem : function (item) {
                let def  =$.Deferred();
                console.log("updateItem", item);
                $.ajax({
                    url :  "/admin/msgcrud",
                    type : "DELETE",
                    data : item,
                    success : function(result){
                        if (result.state = "ok")
                            def.resolve(result.result);
                        else
                            def.reject(result.result);
                    }
                });
                return def;
            }
        },

        rowDoubleClick : function(row){
            item = row.item;
            $("#p_msgmanage_modal_msg").html(row.item.content);
            $("#p_msgmanage_modal_rowdata").modal("show");
        }
    })


})
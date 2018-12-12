/* Practice by JERRY, created on 2018/12/7*/
$(function(){

    $("#p_usermanage_div_userlist").jsGrid({
        width: "100%",
        height: "400px",

        inserting: true,
        editing: true,
        filtering : true,
        sorting: true,
        paging: true,

        autoload: true,
        data: [],

        pageSize : 3,

        fields: [
            { name: "username", type: "text", title: "用户名", editing : false },
            { name: "name", type: "text", title: "姓名", validate: "required" },
            { name: "avator", type: "text", title: "头像", validate: "required" },
            { name: "createTime", type: "text", title: "创建时间", editing : false
                    ,itemTemplate : function(value, item){
                        console.log("value :", value, " item :",item);
                        return new Date(value).toLocaleString();
    }},
            { name: "phone", type: "text", title: "电话" },
            { name: "email", type: "text", title: "邮箱" },
            { type: "control" }
        ],
        controller : {
            loadData : function(filter){
                console.log(filter);
                for(let p in filter){
                    console.log(filter[p]);
                    if(!filter[p]) delete filter[p];
                }
                return $.ajax({
                    url : "/admin/usercrud",
                    type : "GET",
                    data : filter,
                    success : function(result){
                        console.log(result);
                    }
                })
            }

        },
        onItemEditing: function(args) {
            // cancel editing of the row of item with field 'ID' = 0
            console.log(args);
            if(args.item.ID === 0) {
                args.cancel = true;
            }
        },
        editRowRenderer : function(item, itemIndex){
            console.log("item=", item, "itemIndex=", itemIndex);
            let def = $.Deferred();
            $("#p_usermanage_modal_username").text(item.username);
            $("#p_usermanage_modal_name").val(item.name);
            $("#p_usermanage_modal_createtime").text(new Date(item.createTime).toLocaleString());
            $("#p_usermanage_modal_phone").val(item.phone);
            $("#p_usermanage_modal_email").val(item.email);
            $("#p_usermange_modal_rowdata").modal("toggle");
        }
    });



})


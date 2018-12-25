/* Practice by JERRY, created on 2018/12/7*/
$(function(){

    let newItem, oldItem;

    $("#p_usermanage_div_userlist").jsGrid({
        width: "100%",
        height: "400px",

        // inserting: true,
        editing: true,
        filtering : true,
        sorting: true,
        paging: true,

        autoload: true,
        data: [],

        pageSize : 3,

        fields: [
            { name: "_id", type : "text", visible : false},
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
            },
            deleteItem: function(item) {
                let def = $.Deferred();
                $.ajax({
                    type: "DELETE",
                    url: "/admin/usercrud",
                    data: item,
                    success : function(result){
                        if(result.state = "ok"){
                            def.resolve();
                        }
                        else {
                            alert(result.result);
                            def.reject();
                        }
                    }
                });
                return def;
            }

        },

        editRowRenderer : function(item, itemIndex){
            console.log("editRowRenderer");
                        console.log("item=", item, "itemIndex=", itemIndex);
                        let def = $.Deferred();

                        //1、show the modify interface
                        $("#p_usermanage_modal_username").text(item.username);
                        $("#p_usermanage_modal_name").val(item.name);
                        $("#p_usermanage_modal_avator")[0].src = "/admin/image/" + item.username + "/" + item.avator;
                        $("#p_usermanage_modal_createtime").text(new Date(item.createTime).toLocaleString());
                        $("#p_usermanage_modal_phone").val(item.phone);
                        $("#p_usermanage_modal_email").val(item.email);
                        $("#p_usermanage_modal_rowdata").modal("toggle");
                        oldItem = item;

        },

        onDataLoading: function(args) {
            console.log("onDataLoading");
        },    // before controller.loadData
        onDataLoaded: function(args) {
            console.log("onDataLoaded");
        },     // on done of controller.loadData

        onError: function(args) {},          // on fail of any controller call
        onInit: function(args) {
            console.log("onInit");
        },           // after grid initialization

        onItemInserting: function(args) {
            console.log("onItemInserting");
        },  // before controller.insertItem
        onItemInserted: function(args) {
            console.log("onItemInserted");
        },   // on done of controller.insertItem
        onItemEditing: function(args) {
            // cancel editing of the row of item with field 'ID' = 0
            console.log("onItemEditing");
            console.log(args);
            if(args.item.ID === 0) {
                args.cancel = true;
            }
        },
        onItemUpdating : function(args){  // before controller.updateItem
        console.log("onItemUpdating");
        console.log(args);
    },
        onItemUpdated: function(args) {
            console.log("onItemUpdated");
        },    // on done of controller.updateItem
        onItemDeleting: function(args) {
            console.log("onItemDeleting");
        },   // before controller.deleteItem
        onItemDeleted: function(args) {
            console.log("onItemDeleted");
        },    // on done of controller.deleteItem
        onItemInvalid: function(args) {
            console.log("onItemInvalid");
        },    // after item validation, in case data is invalid

        onOptionChanging: function(args) {
            console.log("onOptionChanging");
        }, // before changing the grid option
        onOptionChanged: function(args) {
            console.log("onOptionChanged");
        },  // after changing the grid option

        onPageChanged: function(args) {
            console.log("onPageChanged");
        },    // after changing the current page

        onRefreshing: function(args) {
            console.log("onRefreshing");
        },     // before grid refresh
        onRefreshed: function(args) {
            console.log("onRefreshed");
        },      // after grid refresh
    });

    $("#p_usermanage_modal_input_avator").change(function(){
        let file = $("#p_usermanage_modal_input_avator").get(0).files[0];
        if (file.size < 512000 && file.size >50000){
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                $("#p_usermanage_modal_avator").get(0).src = e.target.result;
        }
        }else{
            alert("图片需大于50K，且小于512K。");
        }
    })

    $("#p_usermanage_modal_rowdata").on("hidden.bs.modal", function (e) {
        console.log("hidden bs modal");
        if(newItem) {
            $("#p_usermanage_div_userlist").jsGrid("updateItem", oldItem, newItem);
            newItem = null;
        }
    else {
            $("#p_usermanage_div_userlist").jsGrid("updateItem", oldItem, {});
            oldItem = null;
        }
    });

    //2、process the modification
    $("#p_usermanage_modal_btn_ok").click(function() {
        //check the valid of data

        //post data to server
        let form = new FormData($("#p_usermanage_modal_form")[0]);
        let message = "";
        let reg;

        if ($("#p_usermanage_modal_name").val() === oldItem.name)
            form.delete("name");
        else {
            reg = /^[a-zA-Z\s\u4e00-\u9fa5]{2,32}$/;
            if (!reg.test($("#p_usermanage_modal_name").val())) {
                message += `&bull;姓名不符合规则，必须两个及以上字符，字符为英文字母大小写、汉字、空格。 <br>`;
            }
        }

        if ($("#p_usermanage_modal_input_avator").val() === "") form.delete("avator");

        if ($("#p_usermanage_modal_phone").val() === oldItem.phone)
            form.delete("phone");
        else {
            reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
            if (!reg.test($("#p_usermanage_modal_phone").val()) && $("#p_usermanage_modal_phone").val().length != 0) {
                message += `&bull;手机号不符合规则。 <br>`;
            }
        }

        if ($("#p_usermanage_modal_email").val() === oldItem.email)
            form.delete("email");
        else {
            reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //邮箱规则
            if (!reg.test($("#p_usermanage_modal_email").val()) && $("#p_usermanage_modal_email").val().length != 0) {
                message += `&bull;邮箱不符合规则。 <br>`;
            }
        }

        if ($("#p_usermanage_modal_pwd1").val() === "")
            form.delete("password");
        else {
            if (!reg.test($("#p_usermanage_modal_pwd1").val())) {
                message += `&bull;密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。<br>`;
            }
        }

        if ($("#p_usermanage_modal_pwd1").val() != $("#p_usermanage_modal_pwd2").val()) {
            message += `&bull;两次密码不一致。 <br>`;
        }

        console.log("name=",form.get("name"));

        if (message.length == 0) {
            form.append("username", oldItem.username);
            $.ajax({
                url: "/admin/usercrud",
                type: "PUT",
                data: form,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result.state === "ok") {
                        //refresh the page data
                        newItem = result.result;
                        // $("#p_usermanage_div_userlist").jsGrid("updateItem",item, result.result);
                        $("#p_usermanage_modal_rowdata").modal("toggle");
                    }else{
                        alert("some error happened, retry pls!")
                    }
                }
            })
        }else{
            alert(message);
            $("#p_usermanage_modal_rowdata").modal("toggle");
        }
    });





})


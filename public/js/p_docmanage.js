/* Practice by JERRY, created on 2018/12/23*/
$(function(){
    $("#p_docmanage_div_doclist").jsGrid({
        width: "100%",

        // inserting: true,
        // editing: true,
        filtering : true,
        sorting: true,
        paging: true,

        autoload: true,
        data: [],

        pageSize : 3,

        fields: [
            { name: "_id", type : "text", visible : false},
            { name: "username", type: "text", title: "用户名"},
            { name: "docname", type: "text", title: "档案号"},
            { name: "matchQty", type: "text", title: "匹配数量"},
            { name: "createdAt", type: "text", title: "创建时间"
                ,itemTemplate : function(value, item){
                    console.log("value :", value, " item :",item);
                    return new Date(value).toLocaleString();
                }},
            { type: "control", editButton: false }
        ],
        controller : {
            loadData : function(filter){
                console.log(filter);
                for(let p in filter){
                    console.log(filter[p]);
                    if(!filter[p]) delete filter[p];
                }
                return $.ajax({
                    url : "/admin/doccrud",
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

        rowClick : function(args){
            console.log(args);
            $("#p_docmanage_modal_rowdata").modal("toggle");
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
})

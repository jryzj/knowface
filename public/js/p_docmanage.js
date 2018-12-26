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
            let item = args.item;
            $("#p_docmanage_span_docname").text(item.docname);
            $("#p_docmanage_span_username").text(item.username);
            $("#p_docmanage_span_name").text(item.name);
            $("#p_docmanage_span_location").text(item.lostLocation);
            $("#p_docmanage_span_date").text(item.lostDate);
            $("#p_docmanage_p_appearance").text(item.appearance);
            $("#p_docmanage_p_descripttion").text(item.description);

            $("#p_docmanage_div_photos").html("");
            let html= "";
            for (let i = 0, length = item.photos.length; i < length; i++){
                html += `<div class="col-md-3 photo" style="padding:1rem">
                    <div class="img-thumbnail" style="width:100%;height:0;padding-bottom: 100%;overflow:hidden">
                    <img class="card-img-top" src="` + `/admin/image/` + item.username + `/` + item.docname + `/` + item.photos[i] + `" alt="Card image cap">
                    </div>
                    </div>`;
            }
            $("#p_docmanage_div_photos").html(html);


            $("#p_docmanage_div_matchedphotos").html("");
/*
            $.ajax({
                url : "/admin/matchedfile",
                type : "GET",
                data : {username : item.username, docname : item.docname},
                success : function (files) {
                    console.log(files);
                    let html = "";
                    for (let i = 0, length = files.length; i < length; i++){
                            html += `<div class="col-md-3 photo" style="padding:1rem">
                    <div class="img-thumbnail" style="width:100%;height:0;padding-bottom: 100%;overflow:hidden">
                    <img class="card-img-top" src="`+ files[i] + `" alt="Card image cap">
                    </div>
                    </div>`;
                        }
                    $("#p_docmanage_div_matchedphotos").html(html);                     
                }
            });
*/

            $.ajax({
                url : "/admin/imagebymatched",
                type : "GET",
                data : {username : item.username, docname : item.docname},
                success : function (files) {
                    console.log(files);
                    let html = "";
                    for (let i = 0, length = files.length; i < length; i++){
                        html += `<div class="col-md-3 photo" style="padding:1rem">
                    <div class="img-thumbnail" style="width:100%;height:0;padding-bottom: 100%;overflow:hidden">
                    <img class="card-img-top" src="data:image/jpeg;base64,`+ files[i] + ` " alt="Card image cap">
                    </div>
                    </div>`;
                    }
                    $("#p_docmanage_div_matchedphotos").html(html);
                }
            });



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

/* Practice by JERRY, created on 2018/8/21*/

$(function () {
    $("#p_userdocs_btn_createdoc").click(function () {
        window.location.href = "/user/p_createdoc";
    });

    $("#p_userdocs_btn_deletedoc").click(function () {
        $("#p_userdocs_modal_deletedoc").modal();
    });

    $("#p_userdocs_btn_delconfirm").click(function () {
        let doclist = [];
        $("#p_userdocs_div_docs input:checked").each(function (i, el) {
            doclist.push(el.id);
        });
        if (doclist.length !== 0) {
            $.ajax({
                url : "/user/p_userdocs/deletedoc",
                data : JSON.stringify({"doclist":doclist}),
                type : "POST",
                contentType : "application/json",
                success :function (result) {
                if (result === "ok"){
                    //不刷新页面，删除元素
                    for (let i = 0, length = doclist.length; i < length; i++){
                        $("#docid-"+doclist[i]).remove();
                    }
                }else if (result === "error" ){
                    window.location.reload(true);
                } else{
                    $("#p_userdocs_modal_err").modal();
                }
            }})

        }

    })

    $("#p_userdocs_btn_readdoc").click(function () {
        let doc = $("#p_userdocs_div_docs input:checked");
        if (doc.length >0) {
            // 这个不知道如何实现？
            // $.get("/user/p_readdoc",{"docname":doc[0].id},function (data) {
            //      document = data;
            //      window.reload();
            // });

            window.location.href = "/user/p_readdoc?docname="+doc[0].id;
        }
    })

    $(".p_userdocs_div_card").dblclick(function () {
        window.location.href = "/user/p_readdoc?docname="+$(this).find("input").attr("id");
    })

    $("#p_userdocs_btn_updatedoc").click(function () {
        let doc = $("#p_userdocs_div_docs input:checked").get(0);
        if (doc != null){
            window.location.href = "/user/p_updatedoc?docname=" + doc.id;
        }
    })


})
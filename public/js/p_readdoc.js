/* Practice by JERRY, created on 2018/8/25*/
$(function(){
    $("#p_readdoc_btn_exit").click(function () {
        window.location.href  = "/user/p_userdocs";
    })

    $("#p_readdoc_btn_deldoc").click(function () {
        $("#p_readdoc_modal_deldoc").modal();
    })

    $("#p_readdoc_btn_exitconfirm").click(function () {
        $.ajax({
            url : "/user/p_userdocs/deletedoc",
            type : "POST",
            data : {doclist : $("#p_readdoc_span_docname").text()},
            success : function(result){
                if (result === "ok"){
                    window.location.href = "/user/p_userdocs"
                } else if (result === "error" ){
                    window.location.reload(true);
                } else{
                    $("#p_readdoc_modal_error").modal();
                }
            }
        })
    })

    $("#p_readdoc_btn_updatedoc").click(function(){
        let docname = $("#p_readdoc_span_docname").text();
        window.location.href = "/user/p_updatedoc?docname=" + docname;
    })

    $("#p_readdoc_div_photos img").dblclick(function(){
        console.log(this.src);
        $("#p_readdoc_modal_img").attr("src",this.src);
        $("#p_readdoc_modal_showimg").modal();
    })

    if(navigator.userAgent.indexOf("MSIE")>=0) {
        $("#p_readdoc_modal_input_showface").click(function () {
            this.blur();
            this.focus();
        })
    }

    $("#p_readdoc_modal_input_showface").change(function(){

        let cWidth = $("#p_readdoc_modal_img").width();
        let cHeight = $("#p_readdoc_modal_img").height();

        $("#p_readdoc_modal_canvas")[0].width=cWidth;
        $("#p_readdoc_modal_canvas")[0].height=cHeight;

        let c = $("#p_readdoc_modal_canvas")[0];
        let ctx=c.getContext("2d");
        ctx.strokeStyle="#FF0000";

        if($("#p_readdoc_modal_input_showface").prop("checked")){

            $.get("/user/p_readdoc/faceframe",{photoUrl : $("#p_readdoc_modal_img").attr("src")}, function (data) {
                data = JSON.parse(data);
                let ration = cWidth / data[4];
                ctx.strokeRect(data[0]*ration, data[1]*ration, data[2]*ration, data[3]*ration);
            })
        }
        else{
            ctx.clearRect(0,0,cWidth,cHeight);
        }
    })

    $("#p_readdoc_modal_showimg").blur(function () {
        let cWidth = $("#p_readdoc_modal_img").width();
        let cHeight = $("#p_readdoc_modal_img").height();

        $("#p_readdoc_modal_canvas")[0].width=cWidth;
        $("#p_readdoc_modal_canvas")[0].height=cHeight;

        let c = $("#p_readdoc_modal_canvas")[0];
        let ctx=c.getContext("2d");
        ctx.clearRect(0,0,cWidth,cHeight);

        $("#p_readdoc_modal_input_showface").prop("checked",false);


    })



})
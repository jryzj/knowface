/* Practice by JERRY, created on 2018/9/13*/
$(function(){
    let timer, flag = false;
    const INTERVAL = 1000;

    $("#p_chkmatch_btn_agree").click(function () {
       let upper={
           name : $("#p_chkmatch_input_name").val(),
           email : $("#p_chkmatch_input_email").val(),
           phone : $("#p_chkmatch_input_phone").val()
       };

       $.post("/save_upper", upper, function(result){
            if(result == "ok"){
                $("#p_chkmatch_modal_ok").modal("show");
            }
       });
    });


    $("#p_chkmatch_modal_btn_ok").click(function(){
        window.location.href = "/p_matchdoc";
    });

        timer = setInterval(function(){
            if(!flag){
                flag = true;
            $.get("/chkmatch",function(result){

                    if(result.state == "error"){
                        $("#p_chkmatch_p_info").text(result.result);
                        clearInterval(timer);
                    }else if(result.state == "notready"){
                        $("#p_chkmatch_p_info").text(`比对中，完成了 ${result.result}，请稍候！`);
                        $("#p_chkmatch_div_progress").width(result.result);
                    }else {
                        console.log(result);
                        $("#p_chkmatch_div_result").html(result);
                        $("#p_chkmatch_div_info").show();
                        clearInterval(timer);
                    }
                flag = false;
                }
            )}}, INTERVAL);


})

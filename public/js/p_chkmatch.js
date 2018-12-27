/* Practice by JERRY, created on 2018/9/13*/
$(function(){
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
       })
    });


    $("#p_chkmatch_modal_btn_ok").click(function(){
        window.location.href = "/p_matchdoc";
    })
})

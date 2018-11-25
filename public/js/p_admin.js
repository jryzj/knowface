/* Practice by JERRY, created on 2018/11/25*/
$(function(){
    $("#p_admin_btn_login").click(function(){
        console.log("button pressed!");
        let operator = $("#p_admin_input_operator").val();
        let password = $("#p_admin_input_password").val();
        $.ajax({
            url : "/admin/login",
            type : "POST",
            data : {operator : operator, password : password},
            success : function(result){
            console.log(result);
        },
            });
    })
})

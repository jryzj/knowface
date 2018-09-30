/* Practice by JERRY, created on 2018/8/10*/
$(function(){
    $("#p_login_btn_submit").click(function(){
        console.log("p_login_btn_submit");
        let form = new FormData($("#p_login_form_login")[0]);
        console.log(form.get("p_login_input_username"));
        let username =  $("#p_login_input_username").val();
        console.log(username);
        $.ajax({
            url : "/p_login/login",
            type : "POST",
            data : form,
            processData : false,
            contentType : false,
            success : function(result){
                console.log("ajax success");
                if(result != true) {
                    //如果y用户不存在或密码错误。。。
                    $("#p_login_form_login")[0].reset();
                    $("#p_login_div_feedback").text("用户名或密码错误，请重新输入！");
                } else {
                    //登陆成功，跳转到用户管理界面
                    console.log("登陆成功");
                    window.location.href = ("/user/p_userdocs");
                }
            },
            error : function (req, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    });
})
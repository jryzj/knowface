/* Practice by JERRY, created on 2018/8/5*/
$(function(){
    //需要输入栏的各种校验
    $("#p_signup_btn_uploadphoto").change(function () {
        let file = $("#p_signup_btn_uploadphoto").get(0).files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =  function(e){
            if (file.size <= 512000){
                $("#p_signup_img_avator").get(0).src = e.target.result;
            }else{
                $("#p_signup_modal_errormsg").text("请选择图片小于500k!");
                $("#p_signup_modal_error").modal("show");
            }
        }
    });

    $("#p_signup_btn_submit").click(function () {
        // 数据校验，写在这里
        console.log("signup_btn_submit");
        let message = ``;
        let reg = /^[a-zA-Z0-9_-]{8,32}$/;  //用户名正则，8到32位（字母，数字，下划线，减号）
        if (!reg.test($("#p_signup_input_username").val())){
            message += `&bull;用户名不符合规则，必须是8到32个字符组成，字符为英文字母大小写、数字、下划线、中划线。<br>`;
        }

        reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; //密码强度正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符

        if (!reg.test($("#p_signup_input_password1").val())){
            message += `&bull;密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。<br>`;
        }

        if($("#p_signup_input_password1").val() != $("#p_signup_input_password2").val()){
            message += `&bull;两次密码不一致。 <br>`;
        }

        reg = /^[a-zA-Z\s\u4e00-\u9fa5]{2,32}$/;
        if (!reg.test($("#p_signup_input_realname").val())){
            message += `&bull;姓名不符合规则，必须两个及以上字符，字符为英文字母大小写、汉字、空格。 <br>`;
        }

        reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //邮箱规则
        if (!reg.test($("#p_signup_input_email").val()) && $("#p_signup_input_email").val().length != 0){
            message += `&bull;邮箱不符合规则。 <br>`;
        }

        reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
        if (!reg.test($("#p_signup_input_phone").val()) && $("#p_signup_input_phone").val().length != 0){
            message += `&bull;手机号不符合规则。 <br>`;
        }

        if (message.length == 0) {
            let username = $("#p_signup_input_username").val();
            $.get("/chkusername",{username : username}, function(result){
                if(result){
                    let form = new FormData($("#p_signup_form")[0]);
                    console.log(form.get("username"));
                    $.ajax({
                            url: "/p_signup/adduser",
                            type: "POST",
                            success: function (result) {
                                console.log("success+", result);
                                $("#p_signup").html(result);
                            },
                            processData: false,
                            contentType: false,
                            data: form
                        }
                    );
                }else{
                    message = "用户名已经存在。"
                    $("#p_signup_modal_errormsg").html(message);
                    $("#p_signup_modal_error").modal("show");
                }
            });
        }else{
            $("#p_signup_modal_errormsg").html(message);
            $("#p_signup_modal_error").modal("show");
        }
    });

    $("#p_signup_btn_cancel").click(function () {
        history.back(-1);
    });
});
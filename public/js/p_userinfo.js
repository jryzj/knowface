/* Practice by JERRY, created on 2018/9/30*/
$(function () {

    let file;
    let pwdFlag = false;
    let realnameFlag = false;
    let emailFlag = false;
    let phoneFlag = false;
    let avatorFlag = false;
    let pwdErr="", realnameErr="", emailErr="", phoneErr="";
    let reg;

    $("#p_userinfo_input_uploadphoto").change(function(){
        file = $("#p_userinfo_input_uploadphoto").get(0).files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            if (file.size <= 512000){
            $("#p_userinfo_img_avator").get(0).src = e.target.result;
            avatorFlag = true;
            }else{
                $("#p_userinfo_modal_msg_text").text("请选择图片小于500k!");
                $("#p_userinfo_modal_msg").modal("show");
            }
        }
    });

    $(".pwd").change(function(){
        if($("#p_userinfo_password1").val().length ==0 && $("#p_userinfo_password2").val().length ==0)
            pwdFlag = false;
       else {
            pwdFlag = true;
            pwdErr = "";
            console.log(pwdFlag);
            reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; //密码强度正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符

            if (!reg.test($("#p_userinfo_password1").val())){
                pwdErr = `&bull;密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。<br>`;
            }

            if($("#p_userinfo_password1").val() != $("#p_userinfo_password1").val()){
                pwdErr = `&bull;两次密码不一致。 <br>`;
            }
        }
    })

    $("#p_userinfo_realname").change(function(){
        realnameFlag = true;
            realnameErr = "";
            reg = /^[a-zA-Z\s\u4e00-\u9fa5]{2,32}$/;
            if (!reg.test($("#p_userinfo_realname").val())){
                realnameErr = `&bull;姓名不符合规则，必须两个及以上字符，字符为英文字母大小写、汉字、空格。 <br>`;
            }
    })

    $("#p_userinfo_email").change(function(){
        emailFlag = true;
        emailErr = "";
        reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //邮箱规则
        if (!reg.test($("#p_userinfo_email").val()) && $("#p_userinfo_email").val().length != 0){
            emailErr = `&bull;邮箱不符合规则。 <br>`;
        }
    })

    $("#p_userinfo_phone").change(function(){
        phoneFlag = true;
        phoneErr = "";
        reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
        if (!reg.test($("#p_userinfo_phone").val()) && $("#p_userinfo_phone").val().length != 0){
            phoneErr = `&bull;手机号不符合规则。 <br>`;
        }
    })


    $("#p_userinfo_btn_submit").click(function(){
        let message = pwdErr + realnameErr + emailErr + phoneErr;
        if(message.length != 0){
            $("#p_userinfo_modal_msg_text").html(message);
            $("#p_userinfo_modal_msg").modal("show");
        }else
            $("#p_userinfo_modal_save").modal("show");
    })

    $("#p_userinfo_btn_saveexit").click(function(){
            let form = new FormData();
            if (pwdFlag) form.append("password",$("#p_userinfo_password1").val());
            if (realnameFlag) form.append("realname",$("#p_userinfo_realname").val());
            if (emailFlag) form.append("email",$("#p_userinfo_email").val());
            if (phoneFlag) form.append("phone",$("#p_userinfo_phone").val());
            if (avatorFlag) form.append("avator", file);

            $.ajax({
                url : "/user/p_updateuserinfo",
                type: "POST",
                processData : false,
                contentType : false,
                data : form,
                success : function (result) {
                    $("#p_userinfo_modal_msg_text").html(result);
                    $("#p_userinfo_modal_msg").modal("show");
                }
            })

    })



})
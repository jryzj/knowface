/* Practice by JERRY, created on 2018/9/30*/
$(function () {

    let pwdFlag = false;
    let realnameFlag = false;
    let emailFlag = false;
    let phoneFlag = false;
    let avatorFlag = false;
    let message = ["","","","",""];
    let reg;

    $("#p_userinfo_input_uploadphoto").change(function(){
        let file = $("#p_userinfo_input_uploadphoto").get(0).files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            if (file.size <= 512000){
            $("#p_userinfo_img_avator").get(0).src = e.target.result;
            avatorFlag = true;
            }else{
                $("#p_userinfo_modal_error_text").text("请选择图片小于500k!");
                $("#p_userinfo_modal_error").modal("show");
            }
        }
    });

    $(".pwd").change(function(){
        if($("#p_userinfo_password1").val().length ==0 && $("#p_userinfo_password2").val().length ==0)
            pwdFlag = false;
       else {
            pwdFlag = true;
            console.log(pwdFlag);
            reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; //密码强度正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符

            if (!reg.test($("#p_userinfo_password1").val())){
                message += `&bull;密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。<br>`;
            }

            if($("#p_userinfo_password1").val() != $("#p_userinfo_password1").val()){
                message += `&bull;两次密码不一致。 <br>`;
            }
        }
    })

    $("#p_userinfo_realname").change(function(){
        realnameFlag = true;
            reg = /^[a-zA-Z\s\u4e00-\u9fa5]{2,32}$/;
            if (!reg.test($("#p_signup_input_realname").val())){
                message += `&bull;姓名不符合规则，必须两个及以上字符，字符为英文字母大小写、汉字、空格。 <br>`;
            }
    })

    $("#p_userinfo_email").change(function(){
        emailFlag = true;
        reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //邮箱规则
        if (!reg.test($("#p_signup_input_email").val()) && $("#p_signup_input_email").val().length != 0){
            message += `&bull;邮箱不符合规则。 <br>`;
        }
    })

    $("#p_userinfo_phone").change(function(){
        phoneFlag = true;
        reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
        if (!reg.test($("#p_signup_input_phone").val()) && $("#p_signup_input_phone").val().length != 0){
            message += `&bull;手机号不符合规则。 <br>`;
        }
    })


    $("#p_userinfo_btn_submit").click(function(){
        if(message.length != 0){
            $("#p_userinfo_modal_error_text").text(message);
            $("#p_userinfo_modal_error").modal("show");
        }else
            $("#p_userinfo_modal_save").modal("show");
    })

    $("#p_userinfo_btn_saveexit").click(function(){
        if(message.length == 0){
            let form = new FormData();
            if()
        }else{
            $("#p_userinfo_modal_error_text").text(message);
            $("#p_userinfo_modal_error").modal("show");
        }








    })






})
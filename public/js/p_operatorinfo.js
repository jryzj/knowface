/* Practice by JERRY, created on 2018/12/5*/
$(function(){
    $("#p_operatorinfo_a_modifypwd").click(function(){
        $("#p_operatorinfo_div_pwd").toggleClass("d-none");
    });

    $("#p_operatorinfo_btn_submit").click(function(){
        let oldpwd =  $("#p_operatorinfo_input_oldpwd").val();
        let newpwd1 =  $("#p_operatorinfo_input_newpwd1").val();
        let newpwd2 =  $("#p_operatorinfo_input_newpwd2").val();

        let message="";
        if(!oldpwd) message +=`请输入旧密码!<br>`;
        if(!(newpwd1&&newpwd2)) message += `请输入新密码!<br>`;
        if(newpwd1 != newpwd2) message += `两次新密码不一样！<br>`;

        let reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; //密码强度正则，最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
        if (!reg.test(newpwd1)){
            message += `密码不符合规则，必须是最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。<br>`;
        }

        if(oldpwd == newpwd1) message += "新旧密码一样！";

        if(!message){
            $.ajax({
                url : "/admin/modifypwd",
                type : "POST",
                data : {oldpwd : oldpwd, newpwd : newpwd1},
                success : function(result){
                    console.log(result);
                    if(result.state == "ok"){
                        alert("密码修改成功!");
                    }else
                        alert(result.result);
                }
            })
        }else
            alert(message);
    })
})

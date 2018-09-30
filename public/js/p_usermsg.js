/* Practice by JERRY, created on 2018/9/25*/
$(function(){
    $("tr").dblclick(function(){
        $.getJSON("/user/p_usermsg/getmsg/"+this.id,function (data) {
            $("#p_usermsg_p_sender").text(data.sender);
            $("#p_usermsg_p_receiver").text(data.receiver);
            $("#p_usermsg_p_senddate").text(data.sendDate);
            $("#p_usermsg_p_content").html(data.content);
            $("#p_usermsg_modal").modal("show");
        })
    })


})
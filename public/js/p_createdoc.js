/* Practice by JERRY, created on 2018/8/15*/

$(function(){

    let photolist ={};
    let photoId = 0;

    $("#p_createdoc_input_uploadphoto").change(function () {
        let photo = $("#p_createdoc_input_uploadphoto").get(0).files[0];
        console.log("photo",photo);
        let reader = new FileReader();

        reader.onload = function(e){
            $("#p_createdoc_div_photos").prepend(`
                <div class="col-3 photo" style="padding:1rem" id="photo-${photoId}">
                        <div class="img-thumbnail" style="width:100%;height:15vw;overflow:hidden">
                            <img class="card-img-top" src="${e.target.result}" alt="Card image cap">
                            <input type="checkbox" id="photochked-${photoId}" style="position:absolute;z-index:1;right:15%;top:15%">
                        </div>
                </div>
                `);
        };
        reader.readAsDataURL(photo);
        photolist["photoId-" + photoId] = photo;
        photoId++;
        console.log("photolist", photolist);
    });
    
    $("#p_createdoc_btn_delphoto").click(function () {
        $("#p_createdoc_div_photos input:checked").each((i, el) => {
            console.log(this);
            console.log(el);
            let id = el.id.split("-")[1];
            $("#photo-"+id).remove();
            delete photolist["photoId-" + id];
        })
    });

    $("#p_createdoc_btn_savedoc").click(function () {
        console.log("savedoc");
        let form = new FormData();

        for (let key in photolist){
            form.append(key,photolist[key]);
        }

        form.append("userdocid",$("#p_createdoc_p_docid").text());
        form.append("name",$("#p_createdoc_input_name").val());
        form.append("location",$("#p_createdoc_input_location").val());
        form.append("date",$("#p_createdoc_input_date").val());
        form.append("appearance",$("#p_createdoc_textarea_appearance").val());
        form.append("description",$("#p_createdoc_textarea_descripttion").val());
        console.log(form);

        $.ajax({
            url : "/user/p_createdoc/save",
            type : "POST",
            data : form,
            processData : false,
            contentType : false,
            success : function (result) {
                if(result == "ok"){
                    alert("保存成功");
                    window.location.href="/user/p_userdocs";
                }else if (result == "redirect"){
                    window.location.reload();
                }else {
                    $("#p_createdoc_modal_error").modal();
                }
            },
            error : function () {
                $("#p_createdoc_modal_error").modal();
            }
        })
    })
    
    $("#p_createdoc_btn_exit").click(function () {
/*        let action = confirm("是否已经保存？");
        if (action){
            window.location.href="/user/p_userdocs";
        }*/
        $("#p_createdoc_modal_exit").modal();
    })



        $("#p_createdoc_btn_exitconfirm").click(function () {
            $.get(
                "/user/p_createdoc/exit",
                "",
                function(result){
                    if (result !== "ok") {
                        alert ("退出失败！");
                    }
                    else
                        window.location.href = "/user/p_userdocs";
                }
            )
        })

    // $("#p_createdoc_modal_exit").on("hide.bs.modal", function (e) {
    //     $("#p_createdoc_btn_exitconfirm").click(function () {
    //         $.get(
    //             "/user/p_createdoc/exit",
    //             "",
    //             function(result){
    //                 if (result !== "ok") {
    //                     alert ("退出失败！");
    //                 }
    //                 else
    //                     window.location.href = "/user/p_userdocs";
    //             },
    //         )
    //     })
    // })
});


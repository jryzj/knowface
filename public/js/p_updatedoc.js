/* Practice by JERRY, created on 2018/8/15*/

$(function(){

    let photolist ={}; //{"photoId-n" : {"photofile" : "" , "newone" : false or true, "removed" : false or true}
    let oldImg = $("#p_updatedoc_div_photos img");
    let photoId = oldImg.length;
    for (let i = 0; i < photoId; i++){
        let src = oldImg[i].src;
        src = src.slice(src.indexOf("/user"));
        photolist["photoId-"+i] = {"photofile" : src, "newone" : false, "removed" : false};
    }

    console.log(oldImg);
    console.log(photolist);


    $("#p_updatedoc_input_uploadphoto").change(function () {
        let photo = $("#p_updatedoc_input_uploadphoto").get(0).files[0];
        console.log("photo",photo);
        let reader = new FileReader();

        reader.onload = function(e){
            $("#p_updatedoc_div_photos").prepend(`
                <div class="col-3 photo" style="padding:1rem" id="photo-${photoId}">
                        <div class="img-thumbnail" style="width:100%;height:15vw;overflow:hidden">
                            <img class="card-img-top" src="${e.target.result}" alt="Card image cap">
                            <input type="checkbox" id="photochked-${photoId}" style="position:absolute;z-index:1;right:15%;top:15%">
                        </div>
                </div>
                `);
        };
        reader.readAsDataURL(photo);
        photolist["photoId-" + photoId] = {"photofile" : photo, "newone" : true, "removed" : false};
        photoId++;
        console.log("photolist", photolist);
    });
    
    $("#p_updatedoc_btn_delphoto").click(function () {
        $("#p_updatedoc_div_photos input:checked").each((i, el) => {
            console.log(this);
            console.log(el);
            let id = el.id.split("-")[1];
            $("#photo-"+id).remove();
            photolist["photoId-" + id].removed = true;
        })
    });

    $("#p_updatedoc_btn_savedoc").click(function () {
        console.log("savedoc");
        let form = new FormData();
        let removedFilelist = [];

        for (let key in photolist){
            if(!photolist[key].removed) {
                if (photolist[key].newone) {
                    form.append(key, photolist[key].photofile);
                }
            }else if (photolist[key].newone === false) {
                removedFilelist.push(photolist[key].photofile);
            }

        }

        console.log("removedFilelist",removedFilelist);

        form.append("userdocid",$("#p_updatedoc_p_docid").text());
        form.append("name",$("#p_updatedoc_input_name").val());
        form.append("location",$("#p_updatedoc_input_location").val());
        form.append("date",$("#p_updatedoc_input_date").val());
        form.append("appearance",$("#p_updatedoc_textarea_appearance").val());
        form.append("description",$("#p_updatedoc_textarea_descripttion").val());
        form.append("removedfilelist", removedFilelist);

        console.log(form);

        $.ajax({
            url : "/user/p_updatedoc/save",
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
                    $("#p_updatedoc_modal_error").modal();
                }
            },
            error : function () {
                $("#p_updatedoc_modal_error").modal();
            }
        })
    })
    
    $("#p_updatedoc_btn_exit").click(function () {
/*        let action = confirm("是否已经保存？");
        if (action){
            window.location.href="/user/p_userdocs";
        }*/
        $("#p_updatedoc_modal_exit").modal();
    })



        $("#p_updatedoc_btn_exitconfirm").click(function () {
            $.get(
                "/user/p_updatedoc/exit",
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
});


/* Practice by JERRY, created on 2018/8/15*/

$(function(){

    let photolist ={};
    let photoId = 0;

    $("#p_matchdoc_input_uploadphoto").change(function () {
        let photo = $("#p_matchdoc_input_uploadphoto").get(0).files[0];
        console.log("photo",photo);
        let reader = new FileReader();

        reader.onload = function(e){
            $("#p_matchdoc_div_photos").prepend(`
                <div class="col-10 col-sm-6 col-md-3 photo" style="padding:1rem" id="photo-${photoId}">
                        <div class="img-thumbnail" style="width:100%;padding-bottom: 100%;height:0;overflow:hidden">
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
    
    $("#p_matchdoc_btn_delphoto").click(function () {
        $("#p_matchdoc_div_photos input:checked").each((i, el) => {
            console.log(this);
            console.log(el);
            let id = el.id.split("-")[1];
            $("#photo-"+id).remove();
            delete photolist["photoId-" + id];
        })
    });

    $("#p_matchdoc_btn_tomatch").click(function () {
        console.log("tomatch");
        if(JSON.stringify(photolist)!=="{}") {
            let form = new FormData();

            for (let key in photolist) {
                form.append(key, photolist[key]);
            }

            console.log(form);

            $.ajax({
                url: "/p_matchdoc/tomatch",
                type: "POST",
                data: form,
                processData: false,
                contentType: false,
                success: function (result) {
                    $("#p_matchdoc_modal_div_msg").text(result.result);
                    $("#p_matchdoc_modal").modal();
                },
                error: function () {
                    $("#p_matchdoc_modal_div_msg").text("提交出错，请重试！");
                    $("#p_matchdoc_modal").modal();
                }
            })
        }

    })
    
    $("#p_matchdoc_btn_exit").click(function () {
        $("#p_matchdoc_modal_exit").modal();
    })



        $("#p_matchdoc_btn_exitconfirm").click(function () {
            window.location.href = "/";
        })

    $("#p_matchdoc_modal").on("hidden.bs.modal", function (e) {
        window.location.href = "/p_chkmatch";
    });

    $("#p_matchdoc_btn_chk").click(function(){
        window.location.href = "p_chkmatch";
    })

});


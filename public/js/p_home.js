/* Practice by JERRY, created on 2018/9/2*/
$(function(){

    let docs, cursor=0, docsTotalQty = 12, docsQty = 4, descLength = 20;
/*    let divtemp = `<div class="card" style="height:35rem">
            <div style="width:100%;padding-bottom: 100%">
                <img class="card-img-top" src=${src} alt="Card image cap" style="position: absolute">
            </div>
            <div class="card-body" style="z-index:1;background-color: white">
                <h5 class="card-title">${name}</h5>
                <div style="height:14rem;overflow: hidden">
                <p class="card-text">${description}</p>
                </div>
                <p class="card-text mt-3"><small class="text-muted">${date}</small></p>
            </div>
        </div>`;*/

    //获取12组文档的信息和照片
    $.get("/random_docs",function(data){
        docs = data;
        console.log(docs);
        $("#p_home_div_carrousel").html("");
        for (let i = cursor, l = cursor+docsQty; i < l ; i++ )
        {
            let src = docs[i].photoPath;
            let name = docs[i].name;
            let description = docs[i].description.slice(0,descLength);
            let date =  docs[i].lostdate;

            $("#p_home_div_carrousel").append(`
            <div class="col-md-3">
            <div class="card" style="height:30rem;overflow: hidden">
            <div style="width:100%;padding-bottom: 100%;">
                    <figure class="figure"  style="position:absolute;width:100%">
                        <img  src=${src} class="figure-img img-fluid rounded card-img-top" alt="">
                    </figure>
            </div>
            <div class="card-body" style="z-index:1;background-color: white; height:15rem">
                <h5 class="card-title">${name}</h5>
                <div style="height:12rem;overflow: hidden">
                <p class="card-text">${description}</p>
                </div>
                <p class="card-text mt-3"><small class="text-muted">${date}</small></p>
            </div>
        </div>
        </div>`);
        }
    });


    $("#p_home_input_tomatch").change(function(){
        let photofile = $("#p_home_input_tomatch").get(0).files[0];
        let reader = new FileReader();

        reader.onload = function(e){
            console.log(e);
        }

        reader.readAsArrayBuffer(photofile);

        let form = new FormData();
        form.append("photofile", photofile);

        $.ajax({
            url: "/p_matchdoc/tomatch",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (result) {
                if (result == "ok") {
                    $("#p_home_modal_ok").modal();
                    // window.location.href = "/p_chkmatch";  //显示请等待
                } else {
                    $("#p_home_modal_error").modal();
                }
            },
            error: function () {
                $("#p_home_modal_error").modal();
            }
        })

    })

    $("#p_home_btn_chk").click(function(){
        window.location.href = "p_chkmatch";
    })


})

$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // Initialize the rich text editor
    initEditor();
    // Define the method of loading article categories
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("Failed to initilize!");
                }
                // Call the template engine to render the category drop-down menu
                var htmlStr = template("tpl-cate", res);
                $("[name=cateId]").html(htmlStr);
                form.render();
            },
        });
    }

    // 1. Initialize the image cropper
    var $image = $("#image");

    // 2. Cropping options
    var options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
    };

    // 3. Initialize crop area
    $image.cropper(options);

    // Bind the click event handler to the select button of the cover.
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    });

    // Listen to the change event of coverFile to get a list of files selected by the user
    $("#coverFile").on("change", function (e) {
        // Get the list array of files
        var files = e.target.files;
        // Determine whether the user has selected a file
        if (files.length === 0) {
            return;
        }
        // According to the file, create the corresponding URL address
        var newImgURL = URL.createObjectURL(files[0]);
        // Reset the picture for the cropped area
        $image
            .cropper("destroy") // Destroy the old crop area
            .attr("src", newImgURL) // Reset image path
            .cropper(options); // Reinitialize the crop area
    });

    var art_state = "published";
    // Bind the click event processing function to save button.
    $("#btnSave2").on("click", function () {
        art_state = "draft";
    });

    // Bind the submit event to the form
    $("#form-pub").on("submit", function (e) {
        // 1. Prevent the default submission behavior of the form
        e.preventDefault();
        // 2. Based on the form form, quickly create a FormData object
        var fd = new FormData($(this)[0]);
        // 3. Save the publication status of the article in fd
        fd.append("state", art_state);
        fd.forEach(function (v, k) {
            console.log(k, v)
        })
        $image
            .cropper("getCroppedCanvas", {
                // Create Canvas
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // Convert the content on the Canvas into a file object
                fd.append("coverImg", blob);
                // Initiate an ajax data request
                publishArticle(fd);
            });
    });

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // Note: If you submit data in FormData format to the server,
            // the following two configuration items must be added
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("Failed to post the article!");
                }
                layer.msg("Succeeded to post the article!");
            },
        });
    }
});
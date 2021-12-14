$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // Get a list of article categories
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/ranking',
            success: function (res) {
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
})


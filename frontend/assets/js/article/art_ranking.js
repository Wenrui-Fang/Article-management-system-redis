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

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        console.log(id)

        //提示用户是否要删除
        layer.confirm('confirm deletion?', { btn: 'Yes, I want to delete', icon: 3, title: 'Attendence' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delrank/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('Failed to delete category!')
                    }
                    layer.msg('Delete category successfully!')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})


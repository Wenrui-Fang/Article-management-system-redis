$(function () {
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // Get a list of article categories
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // Bind the click event for the add category button
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: 'Add Aritcle Type',
      content: $('#dialog-add').html()
    })
  })

  // Binding the submit event for the form-add form through the proxy form
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('Failed to add category!')
        }
        initArtCateList()
        layer.msg('The new category is successfully added!')
        // According to the index, close the corresponding pop-up layer
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: 'Modify article category',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('Failed to update classification data!')
        }
        layer.msg('Successfully updated the classification data!')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    console.log(id)

    //提示用户是否要删除
    layer.confirm('confirm deletion?', { btn: 'Yes, I want to delete', icon: 3, title: 'Attendence' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
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


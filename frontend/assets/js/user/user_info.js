$(function () {
  var form = layui.form;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "The length of the nickname must be between 1 and 6 characters!";
      }
    },
  });

  initUserInfo();

  // Initialize user's basic information
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("Fail to get user's basic information！");
        }
        console.log(res);
        // Assign values ​​to forms
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 重置表单的数据
  $("#btnReset").on("click", function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  });

  // 监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 发起 ajax 数据请求
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("Failed to update user information!");
        }
        layer.msg("Successfully updated user information!");
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      },
    });
  });
});

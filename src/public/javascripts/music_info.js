function extendJQ() {
    jQuery.fn.extend({
        uploadPreview: function (opts) {
            var _self = this,
                _this = $(this);
            opts = jQuery.extend({
                Img: opts.img,
                Width: opts.width,
                Height: opts.height,
                ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                Callback: function () {}
            }, opts || {});
            _self.getObjectURL = function (file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url
            };
            _this.change(function () {
                if (this.value) {
                    if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                        this.value = "";
                        return false
                    }
                    $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                    opts.Callback()
                }
            })
        }
    });
}

window.addEventListener("load", init, false);

function init() {
    // 扩展读片预览功能
    extendJQ();
    $('#up').uploadPreview({ img: 'cover', width: 160, height: 100 });
    
    // 分享音乐选择设置
    setShareCheckbox();

    // 设置保存按钮
    setSaveHandler();

    // 设置发布按钮
    setShareHandler();
}

function setShareCheckbox() {
    $('.share-yes').checkbox('set checked');
    $('.share-yes').checkbox({
        onChecked: function() {
            $('.share-no').checkbox('set unchecked');
        },
        onUnchecked: function() {
            $('.share-yes').checkbox('set checked');
        }
    });
    $('.share-no').checkbox({
        onChecked: function() {
            $('.share-yes').checkbox('set unchecked');
        },
        onUnchecked: function() {
            $('.share-no').checkbox('set checked');
        }
    });
}

function setSaveHandler() {
    $('.save.button').click(function() {
        var title = $('.title-input').val();
        var intro = $('.intro-input').val();
        var tags = $("input:checkbox[name='tag']:checked");
        var isShare = $("input:checkbox[name='share']:checked").val();
        if (title.length < 1 || title.title > 32) {
            showError('标题：字符数限制1~32个');
        }
        else if (intro.length < 1 || intro.length > 200) {
            showError('作品说明：字符数限制1~200个');
        }
        else if (tags.length < 1) {
            showError('标签：作品应至少包含1个标签');
        }
        else {
            $('.error.message').css('display', 'none');
            alert('submit');
            console.log(title);
            console.log(intro);
            console.log(tags);
            console.log(isShare);
            $('form').submit();
        } 
    })
}

function setShareHandler() {
    $('.share.button').click(function() {
        $('.public').checkbox('set checked');
        $('.save.button').click();
    });
    $('.close-share.button').click(function() {
        $('.public').checkbox('set unchecked');
        $('.save.button').click();
    });
}

function showError(message) {
    $('.error-message').text(message);
    $('.error.message').css('display', 'block');
}
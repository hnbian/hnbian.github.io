// 代码块一键复制

$(function () {
    var $copyIcon = $('<i class="fas fa-copy code_copy" title="复制代码" aria-hidden="true"></i>')
    var $notice = $('<div class="codecopy_notice"></div>')
    $('.code-area').prepend($copyIcon)
    $('.code-area').prepend($notice)
    // “复制成功”字出现
    function copy(text, ctx) {
        if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            try {
                var copied = document.execCommand('copy') // Security exception may be thrown by some browsers.
                if (!copied) {
                    throw new Error('The browser rejected the copy command')
                }
                $(ctx).prev('.codecopy_notice')
                    .text("复制成功")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 450, function () {
                        setTimeout(function () {
                            $(ctx).prev('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
                return true
            } catch (ex) {
                $(ctx).prev('.codecopy_notice')
                    .text("复制失败")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 650, function () {
                        setTimeout(function () {
                            $(ctx).prev('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
                return false
            }
        } else {
            $(ctx).prev('.codecopy_notice').text("浏览器不支持复制")
        }
        return false
    }
    // 复制
    $('.code-area .fa-copy').on('click', function () {
        var selection = window.getSelection()
        var range = document.createRange()
        range.selectNodeContents($(this).siblings('pre').find('code')[0])
        selection.removeAllRanges()
        selection.addRange(range)
        var text = selection.toString()
        var copied = copy(text, this)
        if (copied && window.hnbianAnalytics && window.hnbianAnalytics.trackCodeCopy) {
            var codeElement = $(this).siblings('pre').find('code')[0]
            window.hnbianAnalytics.trackCodeCopy(codeElement, text.length)
        }
        selection.removeAllRanges()
    })
});

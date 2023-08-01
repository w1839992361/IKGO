function pageChange(s1, s2, callback) {
    $(s1).fadeOut(function () {
        $(s2).fadeIn(function () {
            if (callback) callback();
        })
    })
}

function closeModel() {
    $('.model').removeClass('active');
}
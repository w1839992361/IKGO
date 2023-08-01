$(() => {
    $(".model_close").click(function (e) {
        if (e.target === e.delegateTarget) {
            closeModel();
        }
    });

    $('.start_btn').click(function () {
        $('.name_model').addClass('active')
    })

    $('.name_btn').submit(function (e) {
        e.preventDefault();
        let val = $('.nameIpt').val();
        if (val.trim().length) {
            console.log(val)
        }
    })

    $('.load_btn').click(function () {
        $('.file_input').click()
    })

    $('.file_input').on('change', function (e) {
        const fr = new FileReader();
        fr.onload = function () {
            let data = null;
            try {
                data = JSON.parse(fr.result)
            } catch (e) {
                data = null;
            }
            if (data) {
                console.log(data)
            }
            $('.file_input').val("")
        }
        fr.readAsText(e.target.files[0])
    })
})
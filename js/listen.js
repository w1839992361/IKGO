$(() => {
    let axis = null;
    $(".model_close").click(function (e) {
        if (e.target === e.delegateTarget) {
            closeModel();
        }
    });

    $('.start_btn').click(function () {
        $('.name_model').addClass('active');
    })
    $('.nameIpt').val("1");

    $('.nameForm').submit(function (e) {
        e.preventDefault();
        let val = $('.nameIpt').val();
        if (val.trim().length) {
            game.info.nickName = val.trim();
            closeModel();
            $('.nameIpt').val("");
            $('.nickName').html('👨' + val.trim());
            pageChange('.start_frame', '.select_frame');
        }
    })

    $('.load_btn').click(function () {
        $('.file_input').click();
    })

    $('.file_input').on('change', function (e) {
        const fr = new FileReader();
        fr.onload = function () {
            let data = null;
            try {
                data = JSON.parse(fr.result);
            } catch (e) {
                data = null;
            }
            if (data) {
                console.log(data);
            }
            $('.file_input').val("");
        }
        fr.readAsText(e.target.files[0]);
    })

    $('.back').click(function () {
        pageChange('.select_frame', '.start_frame');
    })

    $('.level').mousemove(function () {
        $(this).css('margin', '0px 15px 15px 15px')
    }).mouseleave(function () {
        $(this).css('margin', '15px');
    })

    $('.level').click(function () {
        game.init(+$(this).attr('data-level'));
        pageChange('.select_frame', '.game_frame');
    })

    $('#canvas').mousedown((e) => {
        let {x, y} = getPosition(e);
        mouseDown.x = x;
        mouseDown.y = y;
    });

    $('#canvas').mousemove((e) => {
        let {x, y} = getPosition(e);
        mouseMove.x = x;
        mouseMove.y = y;
        if (mouseDown.x !== null && mouseDown.y !== null) {
            if (axis === null) {
                if (Math.abs(mouseDown.y - mouseMove.y) === 0 && Math.abs(mouseDown.x - mouseMove.x) > 1) {
                    axis = 'x';
                }
                if (Math.abs(mouseDown.x - mouseDown.x) === 0 && Math.abs(mouseDown.y - mouseMove.y) > 1) {
                    axis = 'y';
                }
            }
            clearVrRoad();
            for (let x = Math.min(mouseDown.x, mouseMove.x); x <= Math.max(mouseDown.x, mouseMove.x); x++) {
                if (!game.vr_road.find(i => i.x === x && i.y === (axis === 'x' ? mouseDown.y : mouseMove.y))) {
                    game.vr_road.push({x, y: (axis === 'x' ? mouseDown.y : mouseMove.y)})
                }
            }
            for (let y = Math.min(mouseDown.y, mouseMove.y); y <= Math.max(mouseDown.y, mouseMove.y); y++) {
                if (!game.vr_road.find(i => i.x === (axis === 'x' ? mouseMove.x : mouseDown.x) && i.y === y)) {
                    game.vr_road.push({x: (axis === 'x' ? mouseMove.x : mouseDown.x), y})
                }
            }
        }

    });

    $('#canvas').mouseup((e) => {
        let {x, y} = mouseDown;
        if (game.mode === 'build' && x !== null && y !== null) {
            if (game.tool === 'road') {
                if ((game.road.findIndex(i => i.x === x && i.y === y) === -1) && Math.abs(mouseDown.x - mouseMove.x) === 0 && Math.abs(mouseDown.y - mouseMove.y) === 0) {
                    if (moneyIsEnough(-50)) {
                        moneyReduce(-50);
                        game.road.push({x, y});
                    } else {
                        tips('金币不足')
                    }
                }
                let money = game.vr_road.reduce((carry, v_r) => {
                    if (game.road.findIndex(r => r.x === v_r.x && r.y === v_r.y) === -1) {
                        return carry += 50;
                    }
                    return carry;
                }, 0);
                if (game.vr_road.length > 0) {
                    if (moneyIsEnough(-money)) {
                        game.road = game.road.concat(game.vr_road);
                        moneyReduce(-money);
                    } else {
                        tips('金币不足')
                    }
                }
            }
        }
        axis = null;
        clearVrRoad();
        Object.assign(mouseDown, {x: null, y: null})
    });

    $('#canvas').mouseout((e) => {
        Object.assign(mouseDown, {x: null, y: null})
        Object.assign(mouseMove, {x: null, y: null})
    })

    function clearVrRoad() {
        game.vr_road.forEach(i => {
            game.grid[i.y * game.col + i.x].title = null;
        });
        game.vr_road.splice(0, game.vr_road.length);
    }
})
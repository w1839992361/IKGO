import Game from './game.js';
import Canvas from './canvas.js';
import Human from "./human.js";

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
                console.log(data)
                game = new Game();
                game.builds = data.builds;
                game.grid = data.grid;
                game.info = data.info;
                game.start = data.start;
                game.road = data.road;
                closeModel();
                pageChange('.frame', '.game_frame');

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
        if (game.mode === 'Build' && game.tool === 'road' && mouseDown.x !== null && mouseDown.y !== null) {
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
        if (game.mode === 'Build' && x !== null && y !== null) {
            if (game.tool === 'road') {
                if (game.builds.find(i => i.x === mouseDown.x && i.y === mouseDown.y) || game.vr_road.find(i =>
                    game.builds.findIndex(b => b.x === i.x && b.y === i.y) !== -1
                )) {
                    tips('禁止铺路到建筑上');
                } else {
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

            if (game.tool === 'navigator') {
                let item = game.grid.find(r => r.x === mouseDown.x && r.y === mouseDown.y);
                if (item && item?.road_title?.length >= 3) {
                    if (!item.is_navigator) {
                        if (moneyIsEnough(-500)) {
                            game.grid[game.grid.findIndex(r => r.x === mouseDown.x && r.y === mouseDown.y)].is_navigator = true;
                            moneyReduce(-500);
                        } else {
                            tips('金币不足')
                        }
                    } else {
                        tips('不可以重复放置')
                    }
                } else {
                    tips('请将导航放在岔路口')
                }
            }

            if (game.tool === 'remove') {
                let index = game.grid.findIndex(r => r.x === mouseDown.x && r.y === mouseDown.y);
                let item = game.grid[index];
                if (item.is_navigator) {
                    item.is_navigator = false;
                    moneyReduce(500 * 0.8);
                } else if (item.is_rebirth) {
                    item.is_rebirth = false;
                    moneyReduce(1000 * 0.8);
                } else if (item.title === 'road') {
                    game.road.splice(game.road.findIndex(r => r.x === mouseDown.x && r.y === mouseDown.y), 1);
                    item.title = null;
                    moneyReduce(50 * 0.8);
                }
            }

            if (game.tool === 'rebirth') {
                let item = game.grid.find(r => r.x === mouseDown.x && r.y === mouseDown.y);
                let titleMap = ['u', 'r', 'd', 'l'];
                if (game.grid.find(r => r.is_rebirth)) return tips('已存在一个重生之门');
                if (titleMap.includes(item.road_title)) {
                    if (moneyIsEnough(-1000)) {
                        let grid = game.grid[game.grid.findIndex(r => r.x === mouseDown.x && r.y === mouseDown.y)];
                        grid.is_rebirth = true;
                        grid.first_connect = item.road_title;
                        moneyReduce(-1000);
                    } else {
                        tips('金币不足');
                    }
                } else {
                    tips('请将重生之门放在道路末端');
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
    });
    $('.game_toggle').click(() => {
        let mode = $('.game_toggle').html();
        game.mode = mode;
        if (mode === 'Build') {
            game.reset();
        }
        $('.game_toggle').html(mode === 'Launch' ? 'Build' : 'Launch');
    })

    $('.log').click(() => {
        console.log(game)
    })

    $('.setting').click(() => {
        $('.setting_model').addClass('active');
    })

    $('.tools>.tool').mousemove(function () {
        $(this).css('margin', '0px 15px 15px 15px')
    }).mouseleave(function () {
        $(this).css('margin', '15px');
    }).click(function () {
        game.tool = $(this)[0].getAttribute('data-brush');
        $(this).addClass('active').siblings().removeClass('active')
    })

    function clearVrRoad() {
        game.vr_road.forEach(i => {
            game.grid[i.y * game.col + i.x].title = null;
        });
        game.vr_road.splice(0, game.vr_road.length);
    }

    $('.back_home').click(function () {
        game = new Game();
        view = new Canvas('#canvas', game.width, game.height);
        pageChange('.game_frame', '.start_frame');
    })

    $('.play_again').click(function () {
        closeModel();
        game.reset(true);
    })

    $('.next_level').click(function () {
        let level = game.level + 1;
        let now_money = game.info.money;
        let now_score = game.info.score;
        Object.assign(game.info, {
            nickName: "",
            money: 0,
            score: 0,
            time: 100,
            road: [],
            builds: [],
            saveMoney: 0,
            saveScore: 0,
        });

        Object.assign(game.start_info, {
            nickName: "",
            money: 0,
            score: 0,
            time: 100,
        });
        game.init(level);
        game.info.money += now_money;
        game.info.score += now_score;
        game.start_info.money = game.info.money;
        game.start_info.score = game.info.score;
        game.road = [];
        view.drawCell();
        closeModel();
    })

    $('.saveGame').click(function () {
        let info = JSON.parse(JSON.stringify(game.info));
        let builds = JSON.parse(JSON.stringify(game.builds));
        (Math.sign(info.saveScore) === -1) ? info.score += Math.abs(info.saveScore) : info.score -= Math.abs(info.saveScore);
        info.money -= info.saveMoney;
        info.saveScore = 0;
        info.saveMoney = 0;
        info.time = 100;
        let info_build = 0;
        builds.forEach((build, index) => {
            build.human_list.splice(0, build.human_list.length);
            if (build.title === 'birth') {
                for (let i = 0; i < info.builds[info_build].end.length; i++) {
                    build.human_list.push(new Human(build.x, build.y, info.builds[info_build].end[i]));
                }
                info_build++
            }
        });
        let data = JSON.stringify({
            info,
            start: game.start_info,
            builds,
            road: game.road,
            grid: game.grid,
        })

        const href = "data:text/json;charset=utf-8," + encodeURIComponent(data);
        $(`<a href="${href}" download='export.json'></a>`)[0].click();
    })
})
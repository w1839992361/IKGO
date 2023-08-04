import Human from "./human.js";

export default class Game {
    constructor() {
        this.mode = 'Build'; // or Launch
        this.size = 60;
        this.row = Math.floor(window.screen.height / 60) - 3
        this.col = Math.floor(window.screen.width / 60)
        this.height = this.row * this.size;
        this.width = this.col * this.size;
        this.info = {
            nickName: "",
            money: 0,
            score: 0,
            time: 100,
            road: [],
            builds: [],
            saveMoney: 0,
            saveScore: 0,
        }

        this.start_info = {
            nickName: "",
            money: 0,
            score: 0,
            time: 100,
        }

        this.builds = [];
        this.road = [];
        this.vr_road = [];
        this.level = null;
        this.tool = 'road';
        this.grid = [];

        this.rebirthList = [];
        this.is_over = false;

    }

    init(level) {
        this.is_over = false;
        $('.road').click();
        this.level = level;
        this.level_info = levels[this.level - 1];
        this.info.money = this.level_info.money;
        this.start_info.money = this.info.money;
        this.mode = 'Build';
        $('.game_toggle').html('Launch');
        if (level > 1) {
            $('.rebirth').attr('disabled', false);
        } else {
            $('.rebirth').attr('disabled', true);
        }
        this.initBuilds();
    }

    initBuilds() {
        this.builds.splice(0, this.builds.length);
        for (let i = 0; i < this.level_info.end.length + this.level_info.start; i++) {
            let x = randomHandle(this.col - 3, 3);
            let y = randomHandle(this.row - 3, 3);
            if (!this.builds.find(b => b.x === x && b.y === y) && !this.builds.find(b => b.x === x && (b.y === y-- || b.y === y + 1))) {
                this.builds.push({
                    x,
                    y,
                    title: this.level_info.end[i] ?? 'birth',
                    human_list: []
                });
            } else {
                i--;
            }
        }
        let info_index = 0;
        this.builds.filter((item, index) => {
            if (item.title === 'birth') {
                this.info.builds.push({x: item.x, y: item.y, end: []})
                for (let i = 0; i < 5; i++) {
                    let end = this.level_info.end[Math.floor(Math.random() * this.level_info.end.length)];
                    this.builds[index].human_list.push(new Human(item.x, item.y, end));
                    this.info.builds[info_index].end.push(end);
                }
                info_index++;
            }

        });
    }

    secondLoop() {
        if (this.info.time > 0 && this.mode === 'Launch' && !this.is_over) {
            this.info.time--;
        }
    }

    update() {
        let birth = this.builds.filter(b => b.title === 'birth');
        if (birth.every(i => i.human_list.length === 0)) {
            this.is_over = true;
            if (this.info.score > 0) {
                if (this.level === 3) {
                    $('.next_level').addClass('hide');
                } else {
                    $('.next_level').removeClass('hide');
                }
                $('.over_score').html(this.info.score);
                $('.over_time').html(this.info.time);
                $('.win_model').addClass('active');
            } else {
                $('.over_score').html(this.info.score);
                $('.over_time').html(this.info.time);
                $('.lose_model').addClass('active');
            }
        }
    }

    loop() {
        if (this.mode === 'Launch') this.update();
        if (this.is_over) return;
        this.vr_road.filter(i => {
            let index = i.y * this.col + i.x;
            this.grid[index].title = 'vr_road';
        });

        this.road.filter(i => {
            let index = i.y * this.col + i.x;
            this.grid[index].title = 'road';
        });


        this.grid.filter((i, index) => {
            let {x, y} = i;
            if (i.title === 'road' || i.title === 'vr_road') {
                let dirs = getDirs(x, y);
                let rebirth = this.grid.find(it => it.is_rebirth);
                dirs = dirs.filter(dir => (this.road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1 || this.vr_road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1));
                let str = dirs.reduce((carry, item) => {
                    carry += item.str;
                    return carry;
                }, '');
                i.title === 'vr_road' ? ctx.globalAlpha = .5 : ctx.globalAlpha = 1;
                this.builds.find(i => i.x === x && i.y === y - 1) ? str = 'u' + str.replace('u', '') : '';
                if (rebirth) {
                    // const rebirthMap = new Map([
                    //     [{x, y: y - 1}, 'd'],
                    //     [{x, y: y + 1}, 'u'],
                    //     [{x: x - 1, y}, 'r'],
                    //     [{x: x + 1, y}, 'l'],
                    // ]);
                    //
                    // for (const [key, value] of rebirthMap.entries()) {
                    //     console.log(key,value)
                    //     if (eq(rebirth, key) && rebirth.first_connect !== value) {
                    //         str = str.replace(value, '');
                    //     }
                    // }

                    // if (eq(rebirth, {x, y})) {
                    //     str = rebirth.first_connect;
                    // }
                    if (eq(rebirth, {x, y: y - 1}) && rebirth.first_connect !== 'd') {
                        str = str.replace('u', '');
                    }
                    if (eq(rebirth, {x, y: y + 1}) && rebirth.first_connect !== 'u') {
                        str = str.replace('d', '');
                    }
                    if (eq(rebirth, {x: x - 1, y}) && rebirth.first_connect !== 'r') {
                        str = str.replace('l', '');
                    }

                    if (eq(rebirth, {x: x + 1, y}) && rebirth.first_connect !== 'l') {
                        str = str.replace('r', '');
                    }
                    if (eq(rebirth, {x, y})) {
                        str = rebirth.first_connect;
                    }
                }
                view.draw(str === '' ? 'c' : str, x * this.size, y * this.size);
                this.grid[index].road_title = str === '' ? 'c' : str;
                ctx.globalAlpha = 1;
                if (i.is_navigator) {
                    view.draw('navigator', x * this.size, y * this.size);
                }
                if (i.is_rebirth) {
                    view.draw('rebirth', x * this.size, y * this.size);
                }
            }
        });

        this.rebirthList.filter(b => {
            if (this.mode === 'Launch') {
                this.rebirthList[0].is_move = true;
                this.rebirthList[0].move(true);
            }
        })

        this.builds.filter(b => {
            let {x, y} = b;
            for (let i = 0; i < b.human_list.length; i++) {
                if (!b.human_list[i].is_move) view.draw(b.human_list[i].end, ((x * 60) - 10) + i * 13, (y * 60) - 25, 35, 35);
            }
            if (b.title === 'birth') {
                view.draw('house_2', x * this.size, y * this.size);
                if (this.mode === 'Launch' && this.road.find(r => r.x === b.x && r.y === b.y + 1)) { //  && this.rebirthList.length === 0
                    if (b.human_list.length > 0 && !b.human_list[0].is_end) {
                        b.human_list[0].is_move = true;
                        b.human_list[0].move();
                    }
                }
            } else {
                view.draw('house_1', x * this.size, y * this.size);
                view.draw(b.title, x * this.size, y * this.size);
            }
        })

        if (game.mode === 'Build' && mouseMove.x !== null && mouseMove.y !== null) {
            ctx.globalAlpha = .5;
            if (game.tool === 'remove') {
                let grid = this.grid.find(g => g.x === mouseMove.x && g.y === mouseMove.y);
                let tool = '';
                if (grid.is_navigator) {
                    ctx.filter = "brightness(270%)";
                    tool = 'navigator';
                } else if (grid.is_rebirth) {
                    ctx.filter = "brightness(170%)";
                    tool = 'rebirth';
                } else if (grid.title === 'road') {
                    ctx.filter = "brightness(140%)";
                    tool = grid.road_title;
                }
                tool && view.draw(tool, mouseMove.x * 60, mouseMove.y * 60);

            } else {
                view.draw(game.tool === 'road' ? 'c' : game.tool, mouseMove.x * 60, mouseMove.y * 60);
            }
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.rect(mouseMove.x * 60, mouseMove.y * 60, 60, 60);
            ctx.stroke();
            ctx.filter = 'none';
        }
        $('.money').html(this.info.money);
        $('.score').html(this.info.score);
        $('.time').html(this.info.time);
    }

    reset(is_again = false) {
        let info_build = 0;
        this.builds.forEach((build, index) => {
            build.human_list.splice(0, build.human_list.length);
            if (build.title === 'birth') {
                for (let i = 0; i < this.info.builds[info_build].end.length; i++) {
                    build.human_list.push(new Human(build.x, build.y, this.info.builds[info_build].end[i]));
                }
                info_build++
            }
        })
        this.rebirthList = [];
        this.info.time = 100;

        if (is_again) {
            this.is_over = false;
            this.info.money = this.start_info.money;
            this.info.score = this.start_info.score;
            this.road = [];
            view.drawCell();
            this.mode = 'Build';
            $('.game_toggle').html('Launch');
        } else {
            (Math.sign(this.info.saveScore) === -1) ? this.info.score += Math.abs(this.info.saveScore) : this.info.score -= Math.abs(this.info.saveScore);
            this.info.money -= this.info.saveMoney;
        }
        this.info.saveScore = 0;
        this.info.saveMoney = 0;
    }

}
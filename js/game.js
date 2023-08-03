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
            builds: []
        }

        this.builds = [];
        this.road = [];
        this.vr_road = [];
        this.level = null;
        this.tool = 'road';
        this.grid = [];


    }

    init(level) {
        this.level = level;
        this.level_info = levels[this.level - 1];
        this.info.money = this.level_info.money;
        this.initBuilds();
    }

    initBuilds() {
        for (let i = 0; i < this.level_info.end.length + this.level_info.start; i++) {
            let x = randomHandle(this.col - 3, 3);
            let y = randomHandle(this.row - 3, 3);
            if (!this.builds.find(b => b.x === x && b.y === y) || !this.builds.find(b => b.x === x && (b.y === y-- || b.y === y + 1))) {
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

        this.builds.filter((item, index) => {
            if (item.title === 'birth') {
                let info_index = 0;
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

    loop() {
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
                dirs = dirs.filter(dir => (this.road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1 || this.vr_road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1));
                let str = dirs.reduce((carry, item) => {
                    carry += item.str;
                    return carry;
                }, '');
                i.title === 'vr_road' ? ctx.globalAlpha = .5 : ctx.globalAlpha = 1;
                this.builds.find(i => i.x === x && i.y === y - 1) ? str = 'u' + str.replace('u', '') : '';
                view.draw(str === '' ? 'c' : str, x * this.size, y * this.size);
                this.grid[index].road_title = str === '' ? 'c' : str;
                ctx.globalAlpha = 1;
                if (i.is_navigator) {
                    view.draw('navigator', x * this.size, y * this.size);
                }
            }
        });

        this.builds.filter(b => {
            let {x, y} = b;
            if (b.title === 'birth') {
                view.draw('house_2', x * this.size, y * this.size);
                for (let i = 0; i < b.human_list.length; i++) {
                    if (!b.human_list[i].is_move) view.draw(b.human_list[i].end, ((x * 60) - 10) + i * 13, (y * 60) - 25, 35, 35);
                    if (this.mode === 'Launch' && this.road.find(r => r.x === b.x && r.y === b.y + 1)) {
                        if (!b.human_list[0].is_end) {
                            b.human_list[0].is_move = true;
                            b.human_list[0].move();
                        }
                    }
                }
            } else {
                view.draw('house_1', x * this.size, y * this.size);
                for (let i = 0; i < b.human_list.length; i++) {
                    if (!b.human_list[i].is_move) view.draw(b.human_list[i].end, ((x * 60) - 10) + i * 13, (y * 60) - 25, 35, 35);
                }
                view.draw(b.title, x * this.size, y * this.size);
            }
        })

        if (game.mode === 'Build' && mouseMove.x !== null && mouseMove.y !== null) {
            ctx.globalAlpha = .5;
            view.draw(game.tool === 'road' ? 'c' : game.tool, mouseMove.x * 60, mouseMove.y * 60);
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.rect(mouseMove.x * 60, mouseMove.y * 60, 60, 60);
            ctx.stroke();
        }
    }

    reset() {
        this.builds.forEach((build, index) => {
            build.human_list.splice(0, build.human_list.length);
            if (build.title === 'birth') {
                let info_build = 0;
                for (let i = 0; i < this.info.builds[info_build].end.length; i++) {
                    build.human_list.push(new Human(build.x, build.y, this.info.builds[info_build].end[i]));
                }
                info_build++
            }
        })
        this.info.time = 100;
        this.info.score = 0;
    }

}
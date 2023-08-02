export default class Game {
    constructor() {
        this.mode = 'build';
        this.size = 60;
        this.row = Math.floor(window.screen.height / 60) - 3
        this.col = Math.floor(window.screen.width / 60)
        this.height = this.row * this.size;
        this.width = this.col * this.size;
        this.info = {
            nickName: "",
            money: 0,
            score: 0,
            time: 100
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
        for (let i = 0; i < this.level_info.end.length; i++) {
           let item = this.grid[Math.floor(Math.random()*this.grid.length)];
            console.log(item)
        }
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


        this.grid.filter(i => {
            let {x, y} = i;
            if (i.title === 'road' || i.title === 'vr_road') {
                let dirs = getDirs(x, y);
                dirs = dirs.filter(dir => (this.road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1 || this.vr_road.findIndex(i => i.x === dir.x && i.y === dir.y) !== -1));
                let str = dirs.reduce((carry, item) => {
                    carry += item.str;
                    return carry;
                }, '');
                i.title === 'vr_road' ? ctx.globalAlpha = .5 : ctx.globalAlpha = 1;
                view.draw(str === '' ? 'c' : str, x * this.size, y * this.size);
                ctx.globalAlpha = 1;
            }
        });

        if (game.mode === 'build' && mouseMove.x !== null && mouseMove.y !== null) {
            if (game.tool === 'road') {
                view.draw('c', mouseMove.x * 60, mouseMove.y * 60);
            }
        }
        ;
    }
}
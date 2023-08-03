export default class Human {
    constructor(x, y, end) {
        this.x = x;
        this.y = y;
        this.end = end;
        this.is_move = false;
        this.is_end = false;
        this.moveing = {
            x,
            y
        }
        this.pos = {
            x, y
        }
        this.prev = null;
        this.next = null;
    }

    update() {
        let build_index = game.builds.findIndex(i => i.x === this.x && i.y === this.y);
        if (build_index !== -1) {
            if (game.builds[build_index].title === 'birth') {
                game.builds[build_index].human_list.splice(0, 1);
            }
            if (game.builds[build_index].title === this.end) {
                let index = game.builds.findIndex(i => i.x === this.pos.x && i.y === this.pos.y);
                game.builds[build_index].human_list.push(new Human(this.x, this.y, this.end));
                game.builds[index].human_list.splice(0, 1);
            } else {
                game.builds[build_index].human_list.push(new Human(this.x, this.y, this.end));
                let index = game.builds.findIndex(i => i.x === this.pos.x && i.y === this.pos.y);
                game.builds[index].human_list.splice(0, 1);
            }
        }
    }

    move() {
        let {x, y} = {x: this.x, y: this.y};
        if (this.is_move && !this.is_end) {
            let dirs = getDirs(x, y);
            if (!this.next) {
                dirs = dirs.filter(i => game.road.find(r => i.x === r.x && i.y === r.y) && !(i.x === this?.prev?.x && i.y === this?.prev?.y));
                if (game.builds.find(b => (b.x === x && b.y === y - 1) && !(b.x === this?.prev?.x && b.y === this?.prev?.y))) dirs.push(game.builds.find(b => b.x === x && b.y === y - 1));
                let dir = dirs[Math.floor(Math.random() * dirs.length)];
                this.prev = {x, y};

                this.next = {
                    x: dir?.x ?? this.prev.x,
                    y: dir?.y ?? this.prev.y,
                }
                if (x === this.pos.x && y === this.pos.y) this.next = {x, y: y + 1};
            }

            let road = game.grid.find(i=>i.x === this.x && i.y === this.y && i.is_navigator);

            if (road){
                console.log('过红绿灯了',road);
            }

            if (this.next) {
                let diff_x = (this.next.x - this.moveing.x) / 6;
                let diff_y = (this.next.y - this.moveing.y) / 6;
                this.moveing.x += diff_x === 0 ? 0 : diff_x < 0 ? -0.03 : 0.03;
                this.moveing.y += diff_y === 0 ? 0 : diff_y < 0 ? -0.03 : 0.03;
                view.draw('human', this.moveing.x * 60, this.moveing.y * 60);
            }

            if (Math.abs(this.next.x - this.moveing.x) <= 0.05 && Math.abs(this.next.y - this.moveing.y) <= 0.05) {
                this.x = this.next.x;
                this.y = this.next.y;
                this.moveing = this.next;
                this.next = null;
                this.update();
            }
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.is_end = false;
        this.is_move = false;
        this.moveing = {x, y};
        this.prev = null;
        this.next = null;
    }
}
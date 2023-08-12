export default class Human {
    constructor(x, y, end, done = false) {
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
        this.is_rebirth = false;
        this.done = done;
    }

    update() {
        let build_index = game.builds.findIndex(i => i.x === this.x && i.y === this.y);
        if (build_index !== -1) {
            if (game.builds[build_index].title === 'birth') {
                let index = game.builds.findIndex(i => i.x === this.pos.x && i.y === this.pos.y);
                game.builds[index].human_list.splice(0, 1);
                game.info.score -= 100;
                game.info.saveScore -= 100;
            } else if (game.builds[build_index].title === this.end) {
                if (this.is_rebirth) {
                    game.rebirthList.splice(0, 1);
                } else {
                    let index = game.builds.findIndex(i => i.x === this.pos.x && i.y === this.pos.y);
                    game.builds[index].human_list.splice(0, 1);
                }
                game.builds[build_index].human_list.push(new Human(this.x, this.y, this.end));
                moneyReduce(100, this.x, this.y)
                game.info.score += 100;
                game.info.saveScore += 100;
            } else {
                game.info.score -= 100;
                game.info.saveScore -= 100;
                let birth = game.grid[game.grid.findIndex(i => i.is_rebirth)];
                if (birth && !this.done) {
                    game.rebirthList.push(new Human(birth.x, birth.y, this.end, true));
                }
                // game.builds[build_index].human_list.push(new Human(this.x, this.y, this.end));
                if (this.is_rebirth) {
                    game.rebirthList.splice(0, 1);
                } else {
                    let index = game.builds.findIndex(i => i.x === this.pos.x && i.y === this.pos.y);
                    game.builds[index].human_list.splice(0, 1);
                }
            }
        }
    }

    move(is_rebirth = false) {
        this.is_rebirth = is_rebirth;
        let {x, y} = {x: this.x, y: this.y};
        if (this.is_move && !this.is_end) {
            let dirs = getDirs(x, y);
            let rebirth = game.grid.find(i => i.is_rebirth);
            if (!this.next) {
                dirs = dirs.filter(i => game.road.find(r => i.x === r.x && i.y === r.y) && !(i.x === this?.prev?.x && i.y === this?.prev?.y));
                if (rebirth) {
                    dirs = dirs.filter(dir => !(dir.x === rebirth.x && dir.y === rebirth.y));
                }
                if (game.builds.find(b => (b.x === x && b.y === y - 1) && !(b.x === this?.prev?.x && b.y === this?.prev?.y))) dirs.push(game.builds.find(b => b.x === x && b.y === y - 1));
                let dir = dirs[Math.floor(Math.random() * dirs.length)];
                this.prev = {x, y};

                this.next = {
                    x: dir?.x ?? this.prev.x,
                    y: dir?.y ?? this.prev.y,
                }
                if (x === this.pos.x && y === this.pos.y && !is_rebirth) this.next = {x, y: y + 1};
            }

            let road = game.grid.find(i => i.x === this.x && i.y === this.y && i.is_navigator);

            if (road) {
                let end_list = game.builds.filter(i => i.title === this.end);
                let next_list = end_list.map(end => bfs(road, end))
                if (next_list.length) {
                    next_list.sort((a, b) => a.len - b.len);
                    let result = next_list.shift();
                    this.prev = result.p;
                    this.next.x = result.x;
                    this.next.y = result.y;
                }
                // let result = bfs(road, game.builds.find(i => i.title === this.end));
                // if (result) {
                //     this.prev = result.p;
                //     this.next.x = result.x;
                //     this.next.y = result.y;
                // }
            }

            if (this.next) {
                let diff_x = (this.next.x - this.moveing.x) / 6;
                let diff_y = (this.next.y - this.moveing.y) / 6;
                this.moveing.x += diff_x === 0 ? 0 : diff_x < 0 ? -0.03 : 0.03;
                this.moveing.y += diff_y === 0 ? 0 : diff_y < 0 ? -0.03 : 0.03;
                view.draw('human', this.moveing.x * 60, this.moveing.y * 60);
                view.draw(this.end, this.moveing.x * 60+5, this.moveing.y * 60-25,50,50);
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
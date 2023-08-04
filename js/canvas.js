export default class Canvas {
    constructor(dom, width, height) {
        this.canvas = $(dom)[0];
        this.ctx = this.canvas.getContext('2d');
        ctx = this.ctx;
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawCell()
    }

    drawCell() {
        game.grid = [];
        let row = game.row;
        let col = game.col;
        for (let y = 0; y < row; y++) {
            for (let x = 0; x < col; x++) {
                game.grid.push({
                    x,
                    y,
                    title: null,
                    is_rebirth: false,
                    is_navigator: false,
                    first_connect: null,
                    road_title: null,
                })
            }
        }
    }

    drawLine() {
        let row = game.row;
        let col = game.col;
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = '#2d9f5d'
        for (let x = 0; x < col; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * 60, 0);
            this.ctx.lineTo(x * 60, game.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < row; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * 60);
            this.ctx.lineTo(game.width, y * 60);
            this.ctx.stroke()
        }
    }

    draw(key, x, y, w = game.size, h = game.size) {
        this.ctx.drawImage(images[key], x, y, w, h);
    }

    render() {
        this.ctx.clearRect(0, 0, game.width, game.height);
        if (game.mode === 'Build') {
            this.drawLine();
        }
    }
}
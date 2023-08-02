import Game from './game.js';
import Canvas from './canvas.js';

(() => {
    let time = 0;
    let last_time = 0;
    const loop = () => {
        time += performance.now() - last_time;
        if (time > 1000) {
            time = 0;
        }
        view?.render();
        game?.loop();
        requestAnimationFrame(loop)

        last_time = performance.now();
    }
    loop()
})();

game = new Game();
view = new Canvas('#canvas',game.width,game.height);
imageReady().then(res => {
    pageChange('.frame', '.start_frame');
})



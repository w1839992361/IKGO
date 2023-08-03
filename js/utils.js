function pageChange(s1, s2, callback) {
    $(s1).fadeOut(function () {
        $(s2).fadeIn(function () {
            if (callback) callback();
        })
    })
}

function closeModel() {
    $('.model').removeClass('active');
}

function getPosition(e) {
    return {x: Math.floor(e.offsetX / game.size), y: Math.floor(e.offsetY / game.size)};
}

function moneyIsEnough(reduce) {
    return (game.info.money + reduce) >= 0;
}

function moneyReduce(reduce) {
    game.info.money += reduce;
    console.log(reduce);
}

function tips(msg) {
    console.error(msg)
}

function getDirs(x, y) {
    return [
        {x, y: y - 1, str: 'u'},
        {x: x + 1, y: y, str: 'r'},
        {x, y: y + 1, str: 'd'},
        {x: x - 1, y: y, str: 'l'},
    ]
}

function randomHandle(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function eq(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

function bfs(start, end) {
    let q = [start];
    let visited = [start];
}


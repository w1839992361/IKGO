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


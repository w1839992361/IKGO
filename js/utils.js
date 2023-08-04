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

function moneyReduce(reduce, x = mouseMove.x, y = mouseMove.y) {
    if (reduce > 0) {
        game.info.saveMoney += reduce;
    }
    game.info.money += reduce;
    let div = document.createElement('div');
    div.classList.add('reduceMoney');
    div.style.cssText = `top:${y*60}px;left:${x*60}px;`;
    div.addEventListener('animationend', (e) => {
        e.target.remove();
    });
    div.innerHTML = `${Math.sign(reduce) === -1 ? '-' : '+'}$${Math.abs(reduce)}`;
    document.body.append(div)
}

function tips(msg) {
    let div = document.createElement('div');
    div.classList.add('message');
    div.addEventListener('animationend', (e) => {
        e.target.remove();
    });
    div.innerHTML = msg;
    document.body.append(div);
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

function getNode(v) {
    if (v.p && v.p.p) {
        return getNode(v.p);
    }
    return v;
}

function found(p, arr) {
    return arr.findIndex(i => i.x === p.x && i.y === p.y) !== -1;
}

function bfs(start, end) {
    let q = [start];
    let visited = [start];

    while (q.length) {
        let v = q.shift();

        if (eq(v, end)) {
            let result = getNode(v);
            result.len = v.len;
            return result;
        }

        let dirs = getDirs(v.x, v.y);
        dirs.forEach(dir => {
            if (found(dir, visited)) return;

            if (found(dir, game.road) || (eq(dir, end) && dir.x === v.x && dir.y === v.y - 1)) {
                dir.len = (v.len || 1) + 1;
                dir.p = v;
                visited.push(dir);
                q.push(dir);
            }
        })
    }
}



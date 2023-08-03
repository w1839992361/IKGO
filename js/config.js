const levels = [
    {
        money: 3000,
        start: 1,
        end: ['star', 'sun', 'moon']
    },
    {
        money: 5000,
        start: 2,
        end: ['star', 'sun', 'moon']
    },
    {
        money: 8000,
        start: 3,
        end: ['star', 'sun', 'moon', 'star', 'sun', 'moon']
    },
];

let images = {};

let res = [
    loadImage("c", "Asset 6.png"),
    loadImage("ud", "Asset 1.png"),
    loadImage("rl", "Asset 2.png"),
    loadImage("urd", "Asset 3.png"),
    loadImage("udl", "Asset 4.png"),
    loadImage("url", "Asset 5.png"),
    loadImage("c", "Asset 6.png"),
    loadImage("ul", "Asset 7.png"),
    loadImage("rdl", "Asset 8.png"),
    loadImage("ur", "Asset 9.png"),
    loadImage("dl", "Asset 10.png"),
    loadImage("rd", "Asset 11.png"),
    loadImage("urdl", "Asset 12.png"),
    loadImage("r", "Asset 13.png"),
    loadImage("l", "Asset 14.png"),
    loadImage("u", "Asset 15.png"),
    loadImage("d", "Asset 16.png"),
    loadImage("moon", "moon.png"),
    loadImage("sun", "sun.png"),
    loadImage("star", "star.png"),
    loadImage("navigator", "navigator.png"),
    loadImage("rebirth", "rebirth.png"),
    loadImage("remove", "remove.png"),
    loadImage("human", "citizen_1.png"),
    loadImage("house_1", "house_1.png"),
    loadImage("house_2", "house_2.png"),
];


function loadImage(key, src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `./img/${src}`;
        img.onload = function () {
            images[key] = img;
            resolve(img);
        }
    })
}


function imageReady() {
    return new Promise(resolve => {
        Promise.all(res).then(res => resolve(images));
    })
}

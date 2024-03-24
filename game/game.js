// Кода в браузъра
let grid, size = 60, hasGrid = false;
let tekCvqt = "red";
let ip = window.location.origin;

function init() {
    fetch("http://"+ ip +"/grid").then(function (res) {
        res.json().then(function (serverGrid) {
            grid = serverGrid;
            hasGrid = true;
        });
    });
}


function draw() {
    if (hasGrid) {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                context.strokeRect(x * size, y * size, size, size)
                context.fillStyle = grid[x][y];
                context.fillRect(x * size, y * size, size, size)
            }
        }
    }
}
let t= 0;
function update() {
    t++;
    // Зареждаме грид-а от сървъра
    if(t % 100 == 0) { 
        init();
    }
}
function mouseup() {
    let mx = Math.floor(mouseX / size), my = Math.floor(mouseY / size);
    grid[mx][my] = tekCvqt;
    fetch("http://" + ip + "/namacai?X="+mx+"&Y="+my+"&Col="+tekCvqt, {
        method: "POST"
    }).then(function(res) {
        res.json().then(function(resJSON) {
            console.log(resJSON);
        })
    });
}

function keyup(key) {
    if(key == 32) {
        tekCvqt = prompt("NEW COLOR?");
    }
}


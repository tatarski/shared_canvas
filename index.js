// Кода на сървъра
const express   = require('express');
const fs        = require('fs');
const PORT = 3456;

const app = express();
let grid = [];

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function zapishiGridaVuvFail(fileName, grid) {
    let content = JSON.stringify(grid);
    fs.writeFile(fileName, content, function(err) {
        if(err) {
            console.log("GRESKA", err);
        } else {
            console.log("ZAPISAH GRID VUV FAILA");
        }
    });
}
function pochniDaZapisvashVuvFail() {
    setInterval(function() {
        zapishiGridaVuvFail("TEST.txt", grid);
        // Направете така, че grid да се записва във файла
    }, 1000);    
}
function zarediGrid(fileName) {

    if(fs.existsSync(fileName)){
        // Ако има файл, в който се пази grid-a
        fs.readFile(fileName, "utf8", function(err, data) {
            console.log("CHETA FAIL")
            grid = JSON.parse(data);
            pochniDaZapisvashVuvFail();
        });
    } else {
        // Създаваме случаен grid
        for (let x = 0; x < 10; x++) {
            grid[x] = [];
            for (let y = 0; y < 10; y++) {
                grid[x][y] = getRandomColor();
            }
        }
        pochniDaZapisvashVuvFail();       
    }
}
function onServerStart() {
    console.log(`Слушам на порт ${PORT}`);
    zarediGrid("TEST.txt");
}


app.use(express.static('game'));


// При GET request към /zelka
app.get("/zelka", function(req, res) {
    // Върни JSON теста ZELE
    res.json("ZELE");
});

// При GET request към /grid
app.get("/grid", function (req, res) {
    // Отговора е grid
    res.json(grid);
});

// При POST request към /namacai
app.post("/namacai", function (req, res) {
    console.log(req.query);
    // Ако req.query.X или req.query.Y не са числа
    if(isNaN(req.query.X) || isNaN(req.query.Y)) {
        res.json("GRESHNI X ILI Y");
    }
    
    grid[req.query.X][req.query.Y] = req.query.Col;
    res.json("CVETA BESHE SMENEN");
});

app.listen(PORT, onServerStart);
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8081;

const apiKey = "abc123";

function getShips() {
    return JSON.parse(fs.readFileSync('./lib/ships.json','utf8'));
}

function getShipsByType(ships, type) {
    return ships.find(ship => ship.type.toLowerCase() == type.toLowerCase());
}

function getShipByLevel(ship, level) {
    return ship.find(s => s.level == level);
}

function getMods(modules) {
    return JSON.parse(fs.readFileSync(`./lib/${modules}.json`,'utf8'));
}

function getAllMods() {
    return fs.readdirSync('./lib').filter(file => file.indexOf('modules') > 0);
}

function getAllModNames(mods) {
    return mods.map(m => ({
        name: m.name,
        levels: m.data.map(l => l.level)
    }));
}

function getModByName(mod, name) {
    return mod.find(m => m.name.toLowerCase() == name.toLowerCase());
}

function getModByLevel(mod, level) {
    return mod.find(m => m.level == level);
}

function handleQuery(modules, req) {
    let response = modules;
    if (req.query.name) {
        response = req.query.name == "all" ? getAllModNames(response) : getModByName(response, req.query.name).data;
        if (req.query.level) {
            response = getModByLevel(response, req.query.level);
        }
    }
    return response;
}

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.get('/ships', (req, res) => {
    let ships = getShips();
    let response = ships;
    if (req.query.type) {
        response = getShipsByType(ships, req.query.type);
        if (req.query.level) response = getShipByLevel(response.data, req.query.level);
    }
    res.status(200).send(response);
});

app.get('/modules', (req, res) => {
    let response = req.query.type 
        ? handleQuery(getMods(`${req.query.type}-modules`), req) 
        : Object.assign(
            {},
            getAllMods().map(file => JSON.parse(fs.readFileSync('./lib/' + file,'utf8')))
        );
    res.status(200).send(response);
});

app.get('/weapon-modules', (req, res) => {
    let modules = getMods('weapon-modules');
    let response = handleQuery(modules, req);
    res.status(200).send(response);
});

app.get('/shield-modules', (req, res) => {
    let modules = getMods('shield-modules');
    let response = handleQuery(modules, req);
    res.status(200).send(response);
});

app.get('*', (req, res) => {
    res.status(404).send("Page not found");
});

http.listen(port, () => console.log("App listening on port", port));
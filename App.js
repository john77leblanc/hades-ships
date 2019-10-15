const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8081;

const apiKey = "abc123";

const api = require('./api-functions.js');

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

module.exports = () => {
    app.get('/ships', (req, res) => {
        let ships = api.getShips();
        let response = ships;
        if (req.query.type) {
            response = api.getShipsByType(ships, req.query.type);
            if (req.query.level) response = api.getShipByLevel(response.data, req.query.level);
        }
        res.status(200).send(response);
    });

    app.get('/modules', (req, res) => {
        let response = !!Object.keys(req.query).length && !req.query.type
            ? "You must specify a type if using other queries"
            : req.query.type
                ? api.handleQuery(api.getMods(`${req.query.type}-modules`), req) 
                : Object.assign(
                    {},
                    api.getAllMods()
                );
        res.status(200).send(response);
    });

    app.get('*', (req, res) => {
        res.status(404).send("Page not found");
    });

    http.listen(port, () => console.log("App listening on port", port));
}
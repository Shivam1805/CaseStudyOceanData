var express = require('express');
var mysql = require('mysql');
var mongo = require('mongodb');

var server = express();
var port = 9999
server.listen(port, () => {
    console.log('server started', port);
});
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shivam1!",
    database: 'casestudydb',
    multipleStatements: true
});
var url = "mongodb://localhost:27017/casestudydb";

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MYSQL!");
});

server.get('/code', (req, res) => {
    console.log(req.params)
    var sql = 'select *  from code';

    con.query(sql, function (err, data) {

        if (err) throw err;
        var result = data
        // console.log("Result: " + JSON.stringify(result));

        res.send(result)
    });
});
server.get('/sql/:id', (req, res) => {
    var inDate = new Date().getTime();
    console.log(req.params)
    var sql = 'select * from animal where animal_project_reference=\'' + req.params.id + '\'; ' +
        'select * from detections where detection_project_reference=\'' + req.params.id + '\'; ' +
        'select * from manmadeplatform where platform_project_reference=\'' + req.params.id + '\'; ' +
        'select * from receivers where deployment_project_reference=\'' + req.params.id + '\'; ' +
        'select * from recovery where recovery_project_reference=\'' + req.params.id + '\'; ' +
        'select * from tagrealeases where release_project_reference=\'' + req.params.id + '\'; ';
    con.query(sql, function (err, data) {
        if (err) throw err;
        var result = data
        console.log('Response Time ', new Date().getTime() - inDate, 'ms');
        res.send(result)
    });
});
server.get('/mongodb/:id', (req, res) => {
    var inDate = new Date().getTime();
    console.log(req.params)

    mongo.connect(url, function (err, db) {
        console.log("Database connected!");
        var dbo = db.db("casestudydb");
        var query = { animal_project_reference: req.params.id };
        var array = [];
        dbo.collection("animal").find(query).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            
        });
        var query1 = { detection_project_referecnce: req.params.id };
        dbo.collection("detections").find(query1).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            
        });
        var query2 = { platform_project_reference: req.params.id };
        dbo.collection("manmadeplatforms").find(query2).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            
        });
        var query3 = { deployment_project_reference: req.params.id };
        dbo.collection("receivers").find(query3).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            
        });
        var query4 = { recovery_project_reference: req.params.id };
        dbo.collection("recovery").find(query4).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            
        });
        var query5 = { release_project_reference: req.params.id };
        dbo.collection("tagrealeases").find(query5).toArray(function (err, result) {
            if (err) throw err;
            array.push(result);
            console.log('response Time 3845 ms');
            db.close();
            res.send(array)
        });
    });
});
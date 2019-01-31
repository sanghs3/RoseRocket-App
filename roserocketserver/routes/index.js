var express = require('express');
var app = express();

var setup = require('./setup.js');
var driverSim = require('./driverSim.js');
var driverUpdate = require('./handleDriverUpdate.js')
var TruckStops = setup.CreateTruckStops();
var TruckLegs = setup.CreateTruckLegs();
var driverStateObj = setup.InitDriverState(TruckStops);
var cors = require('cors');
app.use(cors());

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/demo', function(req, res, next) {
  	res.render('demo');
});

app.get('/stops', function(req, res, next) {
	res.json(TruckStops);
});

app.get('/legs', function(req, res, next) {
	var TruckLegs = setup.CreateTruckLegs();
	res.json(TruckLegs);
});

app.get('/driverStateObj', function(req, res, next) {
	//console.log(driverStateObj);
	res.json(driverStateObj);
});

app.put('/updateDriverLocation', function(req,res,next){
	var json = req.body;
	var newdriverStateObj = driverUpdate.UpdatedriverStateObj(json,driverStateObj,TruckLegs,TruckStops);
	var startIndex = newdriverStateObj[0]["activeLegID"].charAt(0).charCodeAt(0)-65;
	var timeArr = setup.DriverTime(driverStateObj,Trucklegs,TruckStops, startIndex);
	newdriverStateObj[0]["totalTime"] = timeArr[0];
	newdriverStateObj[0]["timeRem"] = timeArr[1];
	console.log(newdriverStateObj);
	res.json(newdriverStateObj);
});

app.get('/Sim', function(req, res, next) {
	var x = driverSim.runSim(driverStateObj,TruckLegs,TruckStops,null,null,null,null,0);
	res.send("Done");
});

app.get('/addDriver', function(req, res, next) {
	console.log("Bonus");
	res.send("Done");
});

module.exports = app;

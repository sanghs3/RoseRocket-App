module.exports = {

	CreateTruckStops: function(){
	var TruckStops = [
		{
			"Name": "A",
			"x":20,
			"y":10
		},
		{
			"Name": "B",
			"x":20,
			"y":20
		},
		{
			"Name": "C",
			"x":25,
			"y":30
		},
		{
			"Name": "D",
			"x":30,
			"y":100
		},
		{
			"Name": "E",
			"x":35,
			"y":80
		},
		{
			"Name": "F",
			"x":35,
			"y":80
		},
		{
			"Name": "G",
			"x":35,
			"y":30
		},
		{
			"Name": "H",
			"x":40,
			"y":20
		},
		{
			"Name": "I",
			"x":40,
			"y":10
		},
		{
			"Name": "J",
			"x":35,
			"y":15
		},
		{
			"Name": "K",
			"x":25,
			"y":15
		},
		{
			"Name": "L",
			"x":20,
			"y":10
		}
	];
	for(i=12; i<26; i++){
	    temp = {};
	    temp['Name']=String.fromCharCode(i+65);
	    temp['x']=Math.round(Math.random()*40) * 5;
	    temp['y']=Math.round(Math.random()*40) * 5;
	    TruckStops.push(temp);

	}
	//console.log(TruckStops);
	return TruckStops;
},

	CreateTruckLegs: function(){
		Trucklegs=[{
			"startStop": "A",
			"endStop": "B",
			"speedLimit": 100,
			"legID":"AB"
		},
		{
			"startStop": "B",
			"endStop": "C",
			"speedLimit": 60,
			"legID":"BC"
		},
		{
			"startStop": "C",
			"endStop": "D",
			"speedLimit": 80,
			"legID":"CD"
		},
		{
			"startStop": "D",
			"endStop": "E",
			"speedLimit": 120,
			"legID":"DE"
		},
		{
			"startStop": "E",
			"endStop": "F",
			"speedLimit": 40,
			"legID":"EF"
		},
		{
			"startStop": "F",
			"endStop": "G",
			"speedLimit": 40,
			"legID":"FG"
		},
		{
			"startStop": "G",
			"endStop": "H",
			"speedLimit": 100,
			"legID":"GH"
		},
		{
			"startStop": "H",
			"endStop": "I",
			"speedLimit": 100,
			"legID":"HI"
		},
		{
			"startStop": "I",
			"endStop": "J",
			"speedLimit": 50,
			"legID":"IJ"
		},
		{
			"startStop": "J",
			"endStop": "K",
			"speedLimit": 100,
			"legID":"JK"
		},
		{
			"startStop": "K",
			"endStop": "L",
			"speedLimit": 60,
			"legID":"KL"
		}];
		for(i=11; i<25; i++){
		    temp = {};
		    temp['startStop']=String.fromCharCode(i+65);
		    temp['endStop']=String.fromCharCode(i+66);
		    temp['speedLimit']=Math.round(Math.random()*20+1) * 10;
		    while(temp['speedLimit']>200){
		    	temp['speedLimit']=Math.round(Math.random()*20+1) * 10;
		    }
		   	temp['legID']=String.fromCharCode(i+65).concat(String.fromCharCode(i+66));
		    Trucklegs.push(temp);

	}
	//console.log(Trucklegs);
	return Trucklegs;
	},

	InitDriverState: function(TruckStops){
		var driverStateObj = [{
			"driverID": "SS94",
			"activeLegID": "FG",
			"legProgress": "33",
			"DisplaylegProgress": "33",
			"overallProgress":"XX%"
		}];
		var startIndex = driverStateObj[0]["activeLegID"].charAt(0).charCodeAt(0)-65;
		var endIndex = startIndex +1;
		var x = TruckStops[startIndex]['x'];
		var y = TruckStops[startIndex]['y'];
		var dist = (Math.abs(TruckStops[startIndex]['x']-TruckStops[startIndex+1]['x'])+Math.abs(TruckStops[startIndex]['y']-TruckStops[startIndex+1]['y']))*((Number(driverStateObj[0]["legProgress"]))/100);
		if(dist>=Math.abs(TruckStops[endIndex-1]['x'] - TruckStops[endIndex]['x'])){
			if(TruckStops[endIndex-1]['y']>TruckStops[endIndex]['y']){
				x = TruckStops[endIndex]['x'];
				y = TruckStops[endIndex-1]['y'] - (dist - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']));
			}
			else{
				x = TruckStops[endIndex]['x'];
				y = TruckStops[endIndex-1]['y'] + dist - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']);
			}
			
		}
		else{
			if(TruckStops[endIndex-1]['x']>TruckStops[endIndex]['x']){
				x = TruckStops[endIndex-1]['x'] - dist;
			}
			else{
				x = TruckStops[endIndex-1]['x'] + dist;
			}
		}
		x = Math.round(x * 100) / 100;
		y = Math.round(y * 100) / 100;
		driverStateObj[0]["currentAddress"] = {x: x,y: y};
		driverStateObj[0]["DisplaycurrentAddress"] = {x: x,y: y};
		driverStateObj[0]["startAddress"]={x: TruckStops[endIndex-1]['x'],y: TruckStops[endIndex-1]['y']};
		driverStateObj[0]["endAddress"]={x: TruckStops[endIndex]['x'],y: TruckStops[endIndex]['y']};
		var timeArr = module.exports.DriverTime(driverStateObj,Trucklegs,TruckStops, startIndex);
		driverStateObj[0]["totalTime"] = timeArr[0];
		driverStateObj[0]["timeRem"] = timeArr[1];
		return driverStateObj;
	},

	DriverTime: function(driverStateObj,Trucklegs,TruckStops, startIndex){
		var legTime =0;
		var currentLegDistance = 0;
		var timeRem = 0;
		var totalTime = 0;
		for(i=0;i<TruckStops.length-1;i++){
			currentLegDistance = Math.abs(TruckStops[i]['x']-TruckStops[i+1]['x'])+Math.abs(TruckStops[i]['y']-TruckStops[i+1]['y']);
			legTime =  currentLegDistance/Trucklegs[startIndex]["speedLimit"];
			totalTime = totalTime + legTime;
			if(i==startIndex){
				timeRem = timeRem + legTime*(Number(driverStateObj[0]["legProgress"])/100);
			}
			if(i>startIndex){
				timeRem = timeRem + legTime;
			}
			//console.log(i, totalTime, timeRem);
			}
			return [totalTime,timeRem];
		}
		
}
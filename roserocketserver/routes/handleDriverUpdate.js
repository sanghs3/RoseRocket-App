module.exports = {
	UpdatedriverStateObj: function(json,driverStateObj,TruckLegs,TruckStops){
		console.log(json);
		driverStateObj[0]["activeLegID"] = json["activeLegID"];
		driverStateObj[0]["legProgress"] = json["legProgress"];
		driverStateObj[0]["DisplaylegProgress"] = json["legProgress"];
		var startIndex = driverStateObj[0]["activeLegID"].charAt(0).charCodeAt(0)-65;
		var endIndex = startIndex +1;
		var x = TruckStops[startIndex]['x'];
		var y = TruckStops[startIndex]['y'];
		var dist = (Math.abs(TruckStops[startIndex]['x']-TruckStops[startIndex+1]['x'])+Math.abs(TruckStops[startIndex]['y']-TruckStops[startIndex+1]['y']))*((Number(driverStateObj[0]["legProgress"]))/100);
		console.log(TruckStops[endIndex-1]['y']," , ",dist, " , ", Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']));
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
		driverStateObj[0]["currentAddress"] = {x: x,y: y};
		x = Math.round(x * 100) / 100;
		y = Math.round(y * 100) / 100;
		driverStateObj[0]["DisplaycurrentAddress"] = {x: x,y: y};
		driverStateObj[0]["startAddress"]={x: TruckStops[endIndex-1]['x'],y: TruckStops[endIndex-1]['y']};
		driverStateObj[0]["endAddress"]={x: TruckStops[endIndex]['x'],y: TruckStops[endIndex]['y']};
		return driverStateObj;

	}
}

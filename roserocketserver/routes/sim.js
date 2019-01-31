
module.exports = {
	runSim: function(driverStateObj,TruckLegs,TruckStops,dist,time,endIndex, timer){
		if(dist==null){
			console.log(TruckStops,TruckStops.length, TruckLegs, TruckLegs.length);
			var endIndex = driverStateObj[0]["activeLegID"].charAt(1).charCodeAt(0)-65;
			var dist = (Math.abs(TruckStops[endIndex-1]['x']-TruckStops[endIndex]['x'])+Math.abs(TruckStops[endIndex-1]['y']-TruckStops[endIndex]['y']))*(1-(Number(driverStateObj[0]["legProgress"]))/100);
			var time = (dist/TruckLegs[endIndex-1]["speedLimit"]);
			var timer = 0;
			console.log(TruckLegs.length-1, endIndex, TruckLegs[endIndex]["legID"],"Dist: ", dist,"Speed: ",TruckLegs[endIndex]["speedLimit"], time, timer);
		}
		console.log(driverStateObj[0][ac])
	}
}
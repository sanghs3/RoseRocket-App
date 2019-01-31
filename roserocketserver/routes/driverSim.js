var http = require('http').createServer();
var io = require('socket.io')(http);
http.listen(8000);

module.exports = {
	runSim: function(driverStateObj,TruckLegs,TruckStops,dist,time,endIndex, timer,driverNum){
		if(dist==null){
			console.log(TruckStops,TruckStops.length, TruckLegs, TruckLegs.length);
			var endIndex = driverStateObj[driverNum]["activeLegID"].charAt(1).charCodeAt(0)-65;
			var dist = (Math.abs(TruckStops[endIndex-1]['x']-TruckStops[endIndex]['x'])+Math.abs(TruckStops[endIndex-1]['y']-TruckStops[endIndex]['y']));
			var time = (dist/TruckLegs[endIndex-1]["speedLimit"]);
			var timer = (dist/TruckLegs[endIndex-1]["speedLimit"])*(driverStateObj[driverNum]["legProgress"]/100);
		}
/*		console.log(driverStateObj);
*/		
		module.exports.delaySec(driverStateObj,TruckLegs,TruckStops,dist,time,endIndex, timer,driverNum);
		
	},
	updateDriverState: function(driverStateObj,TruckLegs,TruckStops,endIndex,timeDif,driverNum) {
/*						console.log(endIndex, TruckLegs.length);
*/
			if(endIndex==TruckLegs.length){
				driverStateObj[driverNum]["activeLegID"] = "DONE";
				driverStateObj[driverNum]["legProgress"] = "-";
				driverStateObj[driverNum]["DisplaylegProgress"] = "-";
				driverStateObj[driverNum]["currentAddress"] = {x: TruckStops[endIndex]['x'],y: TruckStops[endIndex]['y']};
				driverStateObj[driverNum]["DisplaycurrentAddress"] = {x: TruckStops[endIndex]['x'],y: TruckStops[endIndex]['y']};
				driverStateObj[driverNum]["overallProgress"] = "100%";
				io.sockets.emit('updateDriverState', 'everyone');
				return 0;
			}
			else{
			driverStateObj[driverNum]["activeLegID"] = TruckLegs[endIndex]["legID"];
			endIndex=endIndex+1;
			var dist = Math.abs(TruckStops[endIndex-1]['x']-TruckStops[endIndex]['x'])+Math.abs(TruckStops[endIndex-1]['y']-TruckStops[endIndex]['y']);
			var time = (dist/TruckLegs[endIndex-1]["speedLimit"]);
			driverStateObj[driverNum]["legProgress"] = (timeDif/time)*100;
			driverStateObj[driverNum]["DisplaylegProgress"] = Math.round((timeDif/time) * 10000) / 100;
			var x = TruckStops[endIndex-1]['x'];
			var y = TruckStops[endIndex-1]['y'];
			var distCovered = (Math.abs(TruckStops[endIndex-1]['x']-TruckStops[endIndex]['x'])+Math.abs(TruckStops[endIndex-1]['y']-TruckStops[endIndex]['y']))*((Number(driverStateObj[driverNum]["legProgress"]))/100);
			//console.log(distCovered, TruckStops[endIndex-1]['y'],TruckStops[endIndex]['y']);
			if(distCovered>=Math.abs(TruckStops[endIndex-1]['x'] - TruckStops[endIndex]['x'])){
				if(TruckStops[endIndex-1]['y']>TruckStops[endIndex]['y']){
					x = TruckStops[endIndex]['x'];
					y = TruckStops[endIndex-1]['y'] - (distCovered - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']));
				}
				else{
					x = TruckStops[endIndex]['x'];
					y = TruckStops[endIndex-1]['y'] + distCovered - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']);
				}
				
			}
			else{
				if(TruckStops[endIndex-1]['x']>TruckStops[endIndex]['x']){
					x = TruckStops[endIndex-1]['x'] - distCovered;
				}
				else{
					x = TruckStops[endIndex-1]['x'] + distCovered;
				}
			}
			driverStateObj[driverNum]["currentAddress"] = {x: x,y: y};
			x = Math.round(x * 100) / 100;
			y = Math.round(y * 100) / 100;
			driverStateObj[0]["DisplaycurrentAddress"] = {x: x,y: y};
			driverStateObj[driverNum]["startAddress"]={x: TruckStops[endIndex-1]['x'],y: TruckStops[endIndex-1]['y']};
			driverStateObj[driverNum]["endAddress"]={x: TruckStops[endIndex]['x'],y: TruckStops[endIndex]['y']};
			io.sockets.emit('updateDriverState', 'everyone');
			//console.log(TruckLegs.length-1, endIndex, TruckLegs[endIndex]["legID"],"Dist: ", dist,"Speed: ",TruckLegs[endIndex]["speedLimit"], time, timeDif);
			if(timeDif>=time){
				driverStateObj[driverNum]["legProgress"] = "100";
				module.exports.CheckTruckStopMade(driverStateObj,TruckLegs,TruckStops,dist, time,endIndex,timeDif,driverNum)();
			}
			else{
				
				module.exports.runSim(driverStateObj,TruckLegs,TruckStops,dist,time,endIndex,timeDif,driverNum);
			}

		}
	},

	delaySec: function (driverStateObj,TruckLegs,TruckStops,dist,time,endIndex, timer,driverNum) {
		timer =timer + 0.1;
		setTimeout(module.exports.CheckTruckStopMade(driverStateObj,TruckLegs,TruckStops, dist,time,endIndex, timer,driverNum), 2000);
	},
	CheckTruckStopMade: function(driverStateObj,TruckLegs,TruckStops, dist,time,endIndex, timer,driverNum){
		return function(){			
			if(timer>=time){
				//console.log(timer,time, driverStateObj[driverNum]["activeLegID"],TruckLegs[endIndex-1]["speedLimit"]);
				var timeDif = timer -time;
				module.exports.updateDriverState(driverStateObj,TruckLegs,TruckStops,endIndex,timeDif,driverNum)
			}
			else{
				driverStateObj[driverNum]["legProgress"] = (timer/time)*100;
				driverStateObj[driverNum]["DisplaylegProgress"] = Math.round((timeDif/time) * 10000) / 100;
				var x = driverStateObj[driverNum]["currentAddress"]['x'];
				var y = driverStateObj[driverNum]["currentAddress"]['y'];
				var distCovered = (Math.abs(TruckStops[endIndex-1]['x']-TruckStops[endIndex]['x'])+Math.abs(TruckStops[endIndex-1]['y']-TruckStops[endIndex]['y']))*((Number(driverStateObj[driverNum]["legProgress"]))/100);
				if(distCovered>=Math.abs(TruckStops[endIndex-1]['x'] - TruckStops[endIndex]['x'])){
					if(TruckStops[endIndex-1]['y']>TruckStops[endIndex]['y']){
						x = TruckStops[endIndex]['x'];
						y = TruckStops[endIndex-1]['y'] - (distCovered - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']));
					}
					else{
						x = TruckStops[endIndex]['x'];
						y = TruckStops[endIndex-1]['y'] + distCovered - Math.abs(TruckStops[endIndex-1]['x'] -TruckStops[endIndex]['x']);
					}
					
				}
				else{
					if(TruckStops[endIndex-1]['x']>TruckStops[endIndex]['x']){
						x = TruckStops[endIndex-1]['x'] - distCovered;
					}
					else{
						x = TruckStops[endIndex-1]['x'] + distCovered;
					}
				}
				driverStateObj[driverNum]["currentAddress"] = {x: x,y: y};
				x = Math.round(x * 100) / 100;
				y = Math.round(y * 100) / 100;
				driverStateObj[0]["DisplaycurrentAddress"] = {x: x,y: y};
				io.sockets.emit('updateDriverState', 'everyone');
				module.exports.delaySec(driverStateObj,TruckLegs,TruckStops,dist,time,endIndex, timer,driverNum)
			}

		}
			
	}
}
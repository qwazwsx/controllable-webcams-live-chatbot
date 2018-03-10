//======================ControllableWebcamsLive======================
// made by qwazwsx (/u/thisisatesttoseehowl)
// licenced under https://www.gnu.org/licenses/gpl-3.0.en.html
//
//======================What is this?======================
// it listens to a youtube livestream chat and moves a PTZ webcam based on chat
//
//======================chat commands======================
// L=left
// R=right
// U=up
// D=down
// +=zoom in
// -=zoom out
//
//======================terminal arg breakdown======================
// node bot.js <youtube video id> <api key> <url> <debug>
//
// eg: node bot.js Zs_P316OXxm XXXXXXXXXXXXXXXXXXXXXXXXXXXXX 123.456.789
// 		this listens on https://www.youtube.com/watch?v=Zs_P316OXxm, uses api key XXX..., and sends PTZ commands to 123.456.789
// 
//
// youtube id must be a livestream (duh)
// api key must have access to Youtube Data v3 (see quota usage)
// url must not contain "http(s)://"
// url *can* contain a port
// <not set> no debug data is saved or logged. 1, data is logged. 2, data is saved to debug.log and logged 
//
// ======================api quota usage======================
// this will use around 1 api quota per second
// this can be changed by changing the below var
var chatRefreshTimeout = 1000;
//======================misc======================
// something doesnt work?
// submit an issue on my github
//
// have questions? 
// contact me on discord qwazwsx#6805 or on reddit /u/thisisatesttoseehowl
//============================================

console.log('[INFO] running on youtube.com/watch?v='+process.argv[2]+', controlling '+process.argv[4])

const yt = require('youtube-live-chat');
//const ytClient = new yt(youtube video id, api key with youtube data v3 access);
const ytClient = new yt(process.argv[2], process.argv[3]);
var request = require('request');
const fs = require('fs');



var chats = [''];
var commandMultiplier = [];
var firstTime = true;
//debug mode
//turn this off


ytClient.on('ready', () => {
	console.log('[INFO] READY!')
	ytClient.listen(chatRefreshTimeout)
})


ytClient.on('chat', data => {
	//add new chat to an array
	if (!firstTime){
		debug('[DEBUG] new message: ' + data.snippet.displayMessage)
		//push cleaned up message to an array
		chats.push(data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ',''))
		
		if (data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == 'l' || data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == 'r' || data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == 'u' || data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == 'd' || data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == '+' || data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','') == '-'){
			
			if (commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')] == undefined){
				commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')] = []
			}
			
			console.log(commandMultiplier)
			console.log(commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')])
			
			if (commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')] !== ''){
				commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')].push(data.snippet.displayMessage.toLowerCase().replace(/\D/g,''))
			}commandMultiplier[data.snippet.displayMessage.toLowerCase().replace(/[0-9]/g, '').replace(' ','')]
		}
		
		
	}
})

//L,R,U,D,+,-
//list of text commands
var commands = ['l','r','u','d','+','-','h'];
//list of args for API calls
var commandArgs = ['rpan','rpan','rtilt','rtilt','zoom','zoom','zoom=1&center']
//list of command values for API requests
var commandValues = ['-10','10','10','-10','500','-500','0,0']
var multiplier = 0;
var command;
		
ytClient.on('chatRefreshed', a => {
	firstTime = false;	
	debug('[DEBUG] array "chats" = ' + chats.toString())
	
	//put the amount of times the commands were sent in an array
	var commandTimes = [countInArray(chats,'l'),countInArray(chats,'r'),countInArray(chats,'u'),countInArray(chats,'d'),countInArray(chats,'+'),countInArray(chats,'-'),countInArray(chats,'h')]
	
	//if a command was sent
	if (commandTimes[0]+commandTimes[1]+commandTimes[2]+commandTimes[3]+commandTimes[4]+commandTimes[5]+commandTimes[6] !== 0){
		//return the command as a number 0-6 (corrisponds to commandTimes)
		var command = commandTimes.indexOf(Math.max(...commandTimes))
		debug(command)
		multiplier = 0;
		
		console.log('[ASD]')
		console.log(commandMultiplier.r)
		
		//calculate average of multiplier
		if (commandMultiplier[commands[command]] !== []){
			multiplier = (commandMultiplier[commands[command]].reduce(add,0))/commandMultiplier[commands[command]].length
		}
		
		
		//send API commands
		//if a multiplier exists and the command itsnt home
		if (multiplier !== 0 && command !== 6){
			API(commandArgs[command],commandValues[command]*multiplier)
		}else{
			//if no multiplier or home command
			API(commandArgs[command],commandValues[command])
		}
		
		
		
		
		debug('[DEBUG] command is ' + command)
	}else{
		//if no commands were sent
		var command = 'none'		
	}
	//clear list
	chats = []
	commandMultiplier = []
	
})


function API(api,value,callback){
	//api is the argument (eg: rzoom, center, rtilt)
	//value is the value to set the api arg to
	//callback is an optional callback (i feel weird just eval()-ing it)
	
	request('http://'+process.argv[4]+'/axis-cgi/com/ptz.cgi?'+api+'='+value, function (error, response, body) {
		debug('error:', error); // Print the error if one occurred
		debug('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		debug('body:', body); 
		debug('[INFO] camera PTZ '+api+' - '+value)
		//eval()'s scare me
		//if you say it outloud it sounds like 'evil'
		//https://www.youtube.com/watch?v=urb6WPtoKIk
		if (callback !== undefined){eval(callback);}
	});
}



ytClient.on('error', error => {
	console.error('[ERROR] please check errors.log')
	//console.error(error)
	
	if (error.error.code == 404){
		console.log('[ERROR] 404, livestream has ended or URL is incorrect')
	}
	
	fs.appendFileSync('errors.log', '[ERROR ' + Date() + '] info below \r\n' + JSON.stringify(error) + '\r\n \r\n');

	
})

//not used
ytClient.on('streamsRunning', streams => {
	console.log('[INFO] Account has ' + streams + ' accounts running')
})



//counts how many of a substring is in an array
//https://stackoverflow.com/a/13389463/6088533
function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

//debug output
//this function handles debug console.log calls
function debug(a){

	if(process.argv[5] == 1){
		console.log(a);
	}else{
		if(process.argv[5] == 2){
			console.log(a);
			fs.appendFileSync('debug.log', a + ' \r\n');
		}
	}
	
}

//helper func for reduce
function add(a, b) {
    return a + b;
}


debug('[DEBUG] debug level is ' + process.argv[5]);
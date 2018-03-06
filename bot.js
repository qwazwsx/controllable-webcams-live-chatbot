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
// debug enables extra logging, should be either true or not set. 
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



var chats = ['']
var firstTime = true;
//debug mode
//turn this off
if (process.argv[5] == "true"){
	var debugMode = true
}else{
	var debugMode = false
}

ytClient.on('ready', () => {
	console.log('[INFO] READY!')
	ytClient.listen(chatRefreshTimeout)
})


ytClient.on('chat', data => {
	//add new chat to an array
	if (!firstTime){
		debug('[DEBUG] new message: ' + data.snippet.displayMessage)
		chats.push(data.snippet.displayMessage.toLowerCase())
	}
})


ytClient.on('chatRefreshed', a => {
	firstTime = false;	
	debug('[DEBUG] array "chats" = ' + chats.toString())
	//put the amount of times the commands were sent in an array
	var commandTimes = [countInArray(chats,'l'),countInArray(chats,'r'),countInArray(chats,'u'),countInArray(chats,'d'),countInArray(chats,'+'),countInArray(chats,'-')]
	
	//if a command was sent
	if (commandTimes[0]+commandTimes[1]+commandTimes[2]+commandTimes[3]+commandTimes[4]+commandTimes[5] !== 0){
		//return the command as a number 0-3 (corrisponds to commandTimes)
		var command = commandTimes.indexOf(Math.max(...commandTimes))
		var commandList = ['left','right','up','down','300','-300']
		
		if (command <= 3){
			request('http://'+process.argv[4]+'/axis-cgi/com/ptz.cgi?move='+commandList[command], function (error, response, body) {
				//console.log('error:', error); // Print the error if one occurred
				//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				//console.log('body:', body); // Print the HTML for the Google homepage.
				console.log('[INFO] moved camera '+commandList[command])
			});
		}else{
			request('http://'+process.argv[4]+'/axis-cgi/com/ptz.cgi?rzoom='+commandList[command], function (error, response, body) {
				//console.log('error:', error); // Print the error if one occurred
				//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				//console.log('body:', body); // Print the HTML for the Google homepage.
				console.log('[INFO] moved camera '+commandList[command])
			});
		}
		
		//http://129.79.35.247/axis-cgi/com/ptz.cgi?rzoom=200
		
		debug('[DEBUG] command is ' + command)
	}else{
		//if no commands were sent
		var command = 'none'		
	}
	//clear list
	chats = []
	
})




ytClient.on('error', error => {
	console.error('[ERROR] '+ error)
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
	if(debugMode){
		console.log(a)
	}
	
}

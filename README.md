# controllable-webcams-live
made by qwazwsx (/u/thisisatesttoseehowl)

## What is this

it listens to a youtube livestream chat and moves a PTZ webcam based on chat

## chat commands
* L=left
* R=right
* U=up
* D=down
* +=zoom in
* -=zoom out

## terminal arg breakdown
 `node bot.js <youtube video id> <api key> <url> <debug>`

eg: `node bot.js Zs_P316OXxm XXXXXXXXXXXXXXXXXXXXXXXXXXXXX 123.456.789`
 		this listens on https://www.youtube.com/watch?v=Zs_P316OXxm, uses api key XXX..., and sends PTZ commands to 123.456.789
 

* youtube id must be a livestream (duh)
* api key must have access to Youtube Data v3 (see quota usage)
* url must not contain "http(s)://"
* url *can* contain a port
* debug enables extra logging, should be either true or not set. 

## api quota usage
this will make around 1 request per second. this can be changed by changing the var `chatRefreshTimeout` located at the top of the file

## misc

* something doesnt work?

submit an issue on my github

* have questions? 

contact me on discord qwazwsx#6805 or on reddit /u/thisisatesttoseehowl

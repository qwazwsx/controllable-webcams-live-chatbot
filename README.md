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
* h=home

you can specify a multiplier to commands
do this by adding a number after the chat command
eg:
"r 2" moves twice the distance that "r" does
"+5" moves 5 times the distance that "+" does

note: if the multiplier is too large the camera will return an error ([specific limits here  on p20](https://www.axis.com/files/manuals/vapix_ptz_52933_en_1307.pdf))


## terminal arg breakdown
 `node bot.js <youtube video id> <api key> <url> <debug>`

eg: `node bot.js Zs_P316OXxm XXXXXXXXXXXXXXXXXXXXXXXXXXXXX 123.456.789`
 		this listens on https://www.youtube.com/watch?v=Zs_P316OXxm, uses api key XXX..., and sends PTZ commands to 123.456.789
 

* youtube id must be a livestream (duh)
* api key must have access to Youtube Data v3 (see quota usage)
* url must not contain "http(s)://"
* url *can* contain a port
* having debug not set disables all debugging
* setting debug to 1 enables debug output in the console
* setting debug to 2 enables both debug output in the console and to debug.log

## api quota usage
this will make around 1 request per second. this can be changed by changing the var `chatRefreshTimeout` located at the top of the file

## misc

* something doesnt work?

submit an issue on my github

* have questions? 

contact me on discord qwazwsx#6805 or on reddit /u/thisisatesttoseehowl

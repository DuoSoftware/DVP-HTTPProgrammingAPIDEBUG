
var readline = require('readline');
var socket = require('socket.io-client')('http://localhost:8088');
var clc = require('cli-color');

socket.on('connect', function(){

    socket.send('data XXXXXXXXX');

});
socket.on('event', function(data){

    console.log(data);

});
socket.on('disconnect', function(){


    console.log('disconnect');
    process.exit(0);
});


var rl = readline.createInterface(process.stdin, process.stdout);
//rl.setPrompt('guess> ');
rl.prompt();
rl.on('line', function(line) {

    socket.send(line);
    if (line === "right") rl.close();
    rl.prompt();

}).on('close',function(){
    process.exit(0);
});
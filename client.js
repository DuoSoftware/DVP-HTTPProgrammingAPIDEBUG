
var readline = require('readline');
var config = require('config');
var socket = require('socket.io-client')(config.Debug.ip+":"+config.Debug.port);
var clc = require('cli-color');

function ReconnectServer()
{
    socket.on('connect', function(){

        socket.send('data XXXXXXXXX');

    });
    socket.on('event', function(data){

        console.log(data);

    });
    socket.on('message', function(data){

        //clc.red('red') + ' plain ' + clc.blue('blue')
        data.forEach(function(item){

            if(item.type == "message"){

                console.log(clc.green("Info: ") + clc.green(item.info));
                console.log(item.data);

            }else if(item.type == "warnning"){
                console.log(clc.yellow("Info: ") + clc.yellow(item.info));
                console.log(item.data);


            }else if(item.type == "action"){

                console.log(clc.blue("Info: ") + clc.blue(item.info));
                console.log(item.data);


            }else if(item.type == "error"){


                console.log(clc.red("Info: ") + clc.red(item.info));
                console.log(item.data);
                socket.disconnect();

            }

        });

        //console.log(data);

    });

    socket.on('disconnect', function(){


        console.log('Disconnected with server \n'+"Press x for exit \n");
        // process.exit(0);
    });


}

ReconnectServer();



var rl = readline.createInterface(process.stdin, process.stdout);

//rl.setPrompt('guess> ');
rl.prompt();

rl.on('line', function(line) {

    socket.send(line);

    if (line == "x")
    {
        rl.close();
        rl.prompt();
        process.exit(0);
    }
    else
    {
        console.log("Press x for exit \n");
    }




}).on('close',function(){
    process.exit(0);
});
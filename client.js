
var readline = require('readline');
var config = require('config');
var socket = require('socket.io-client')(config.Socket.ip+":"+config.Socket.port);
var clc = require('cli-color');

var argsNum=0;
var IsDone=false;
var AppID="";
var Caller_Direction="";
var Caller_Caller_ID_Number="";
var Caller_Destination_Number="";
var Caller_Caller_ID_Name="";
var result="";

function ReconnectServer()
{
    socket.on('connect', function(){
        console.log('connected');

        // socket.send('data XXXXXXXXX');

        argsNum++;
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

               IsDone=true;
               socket.disconnect();
                //console.log('got it');


            }

        });

        //console.log(data);


    });

    socket.on('disconnect', function(){


        console.log('Disconnected with server \n'+"Press x for exit \n");
        //process.exit(0);
    });


}

ReconnectServer();



var rl = readline.createInterface(process.stdin, process.stdout);

//rl.setPrompt('guess> ');

console.log('Press x to exit or d to start debugging');
rl.prompt();

rl.on('line', function(line) {


    if (line == "x")
    {
        rl.close();
        process.exit(0);

    }

    else if(line == "d")
    {
        if(!IsDone)
        {
            console.log('\n Enter Application ID : ');
            rl.prompt();
        }
    }
    else
    {
        switch (argsNum) {
            case 1:
                //console.log('\n Enter Application ID \n');
                //rl.prompt();
                AppID=line;
                console.log("App Id is : " + AppID);
                argsNum++;
                console.log('\n Enter Caller-Direction : ');
                rl.prompt();
                break;
            case 2:

                Caller_Direction=line;
                console.log("Caller_Direction is : " + Caller_Direction);
                argsNum++;
                console.log('\n Enter Caller-Caller-ID-Number : ');
                rl.prompt();

                break;
                break;
            case 3:
                Caller_Caller_ID_Number=line;
                console.log("Caller_Direction is : " + Caller_Caller_ID_Number);
                argsNum++;
                console.log('\n Enter Caller-Destination-Number : ');
                rl.prompt();
                break;
            case 4:

                Caller_Destination_Number=line;
                console.log("Caller_Destination_Number is : " + Caller_Destination_Number);
                argsNum++;
                console.log('\n Enter Caller-Caller-ID-Name : ');
                rl.prompt();
                break;
            case 5:

                Caller_Caller_ID_Name=line;
                console.log("Caller_Caller_ID_Name is : " + Caller_Caller_ID_Name);
                argsNum++;
                console.log('\n Enter result : ');
                rl.prompt();

                break;
            case 6:
                console.log('dddd');
                result=line;
                argsNum=0;
                //rl.close();
                console.log("hit1");
                ObjectCreater();
                break;

        }
    }




}).on('close',function(){
    process.exit(0);
});

function ObjectCreater()
{
    console.log("hit2");
    var Data={
        "AppID":AppID,
        "Caller_Direction":Caller_Direction,
        "Caller_Caller_ID_Number":Caller_Caller_ID_Number,
        "Caller_Destination_Number":Caller_Destination_Number,
        "Caller_Caller_ID_Name":Caller_Caller_ID_Name,
        "result":result
    }
    console.log(Data);
    socket.send(JSON.stringify(Data));

}
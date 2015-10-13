
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
var uuid = require('node-uuid');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var sessionID='';
var IsSessionFill=false;



function ReconnectServer()
{
    var reqIdX='';

    try
    {
        reqIdX = uuid.v1();
    }
    catch(ex)
    {

    }
    socket.on('connect', function(){
        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   Socket connected ',reqIdX);

        argsNum++;
    });
    socket.on('event', function(data){
        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   Socket event fired  %s',reqIdX,data);
        console.log(data);

    });
    socket.on('message', function(data) {


            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   Socket message received  %s', reqIdX, data);
        data.forEach(function (item) {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   Socket' +
            'message received data type of  %s', reqIdX, item);
            if (item.type == "message") {

                console.log(clc.green("Info: ") + clc.green(item.info));
                if(IsSessionFill)
                {
                    console.log("session already filled ",sessionID);
                    console.log(typeof (item.data));
                    console.log(item.data);
                }else
                {
                    console.log(typeof (item.data));
                    console.log(item.data);
                    sessionID=item.data.session;

                    IsSessionFill=true;
                }


            } else if (item.type == "warnning") {
                console.log(clc.yellow("Info: ") + clc.yellow(item.info));
                console.log(item.data);


            } else if (data.type == "session") {

                console.log("Session Hit");
                if(!sessionID)
                {
                    sessionID = item.ID;
                }

                console.log("SessionID recieved " + sessionID);

            } else if (item.type == "action") {

                console.log(clc.blue("Info: ") + clc.blue(item.info));
                console.log(item.data);
                InputSender(item.data);


            } else if (item.type == "error") {


                console.log(clc.red("Info: ") + clc.red(item.info));
                console.log(item.data);

                IsDone = true;

                socket.disconnect();


            }

        });



    });

    socket.on('disconnect', function(){

        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   Socket disconnected',reqIdX);
        IsDone=false;
        argsNum=0;
    });


}

ReadlineManager();

function ReadlineManager()
{
    ReconnectServer();
    var rl = readline.createInterface(process.stdin, process.stdout);


    console.log('Press x to exit or d to start debugging');
    rl.prompt();

    rl.on('line', function(line) {


        if (line == "x")
        {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [READLINE] - Read line received % and closing ',line);
            rl.close();
            process.exit(0);

        }

        else if(line == "d")
        {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [READLINE] - Read line received % ',line);
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
        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [READLINE] - Read line closed ');
        process.exit(0);
    });

}


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
    };
    console.log(Data);
    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s]  - Data for Socket push %s',JSON.stringify(Data));
    socket.send(JSON.stringify(Data));

}

function InputSender(dt)
{
    console.log(JSON.stringify(dt));
    var rl = readline.createInterface(process.stdin, process.stdout);
    console.log('Enter your choice');
    rl.prompt();
    rl.on('line', function(line) {

        var DataIn={
            "AppID":AppID,
            "Caller_Direction":Caller_Direction,
            "Caller_Caller_ID_Number":Caller_Caller_ID_Number,
            "Caller_Destination_Number":Caller_Destination_Number,
            "Caller_Caller_ID_Name":Caller_Caller_ID_Name,
            "result":line,
            "session_id":sessionID
        };
        console.log(DataIn);

        socket.send(JSON.stringify(DataIn));
    });



}

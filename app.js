
var request = require('request');
var Dbcon=require('dvp-dbmodels');
var config=require('config');
var io = require('socket.io')(config.Host.port);
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var uuid = require('node-uuid');
var validator=require('validator');

var data=[];
io.on('connection', function (socket) {
    var reqId='';
    console.log("connected");

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Connection Starts  ',reqId);

    socket.on('disconnect', function (disReason) {

        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Disconnection starts  ');
        console.log(disReason);


    data["exiting"]="true";
        data["session_id"]=socket.Session;

        var HIP=config.HTTPServer.ip;
        var HPORT=config.HTTPServer.port;

        var url = HIP+"/debug/push";

        if(validator.isIP(HIP))
        {
            url = HIP+":"+HPORT+"/debug/push";
        }


        var optionsX = {url: url, method: "POST", json: data};


        request(optionsX, function (errorX, responseX, dataX) {

            if (!errorX && responseX != undefined && responseX.statusCode == 200) {

                logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Disconnection request sends successfully   ',JSON.stringify(responseX.body));
                socket.send(responseX.body);


            }
        });

    });


    socket.on('message', function (dataz) {

        var reqIdX='';

        try
        {
            reqIdX = uuid.v1();
        }
        catch(ex)
        {

        }
        data=JSON.parse(dataz);
        console.log("type of 1"+typeof(data));

        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket received data  %s',reqIdX,data);
        if(socket.Session)
        {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket is already started  ',reqIdX);

            var HIP=config.HTTPServer.ip;
            var HPORT=config.HTTPServer.port;

            var url = HIP+"/debug/push";

            if(validator.isIP(HIP))
            {
                url = HIP+":"+HPORT+"/debug/push";
            }


            var optionsX = {url: url, method: "POST", json: data};



            request(optionsX, function (errorX, responseX, dataX) {

                if (!errorX && responseX != undefined && responseX.statusCode == 200) {

                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends response ',reqIdX,JSON.stringify(responseX.body));
                    socket.send(responseX.body);


                }else
                {
                    logger.error('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends error  ',reqIdX,JSON.stringify(errorX));
                    socket.send(errorX);
                }
            });
        }
        else
        {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket starting stage  ',reqIdX);
            Dbcon.Application.find({where:{id:data.AppID}}).then(function(result)
            {
                if(!result)
                {
                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - [PGSQL] - No Records for Application %s  ',reqIdX,data.AppID);

                }
                else
                {
                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - [PGSQL] - Records for Application %s  ',reqIdX,data.AppID);
                    var sessionid = '';

                    var createData = {
                        "url": result.Url,//"http://192.168.5.35/ivr/index.json",
                        "company": data.CompanyId,
                        "tenant": data.TenantId,
                        "pbx": config.APP.pbx,
                        "appid": data.AppID,
                        "domain": config.APP.domain,
                        "profile": config.APP.profile,
                        "app":data.AppName
                    };

                    var HIP=config.HTTPServer.ip;
                    var HPORT=config.HTTPServer.port;

                    var url = HIP+"/debug/push";

                    if(validator.isIP(HIP))
                    {
                        url = HIP+":"+HPORT+"/debug/create";
                    }


                    var options = {url: url, method: "POST", json: createData};


                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   HTTP request creation Data ',reqIdX,JSON.stringify(createData));

                    request(options, function (error, response, data) {

                        if (!error && response != undefined && response.statusCode == 200) {

                            sessionid = response.body;
                            var sessionObj={"type":"session","ID":sessionid.toString()};
                            var ArrSessionObj=[];
                            ArrSessionObj.push(sessionObj);


                            socket.Session=sessionid;

                            var requestData = {
                                "session_id": sessionid,
                                "Caller-Direction": data.Caller_Direction,
                                "Caller-Caller-ID-Number": data.Caller_Caller_ID_Number,
                                "Caller-Destination-Number": data.Caller_Destination_Number,
                                "Caller-Caller-ID-Name": data.Caller_Caller_ID_Name,
                                "result": data.result,
                                "AppID":data.AppID

                            };

                            var HIP=config.HTTPServer.ip;
                            var HPORT=config.HTTPServer.port;

                            var url = HIP+"/debug/push";

                            if(validator.isIP(HIP))
                            {
                                url = HIP+":"+HPORT+"/debug/push";
                            }


                            var optionsX = {url: url, method: "POST", json: requestData};



                            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   HTTP request push Data ',reqIdX,JSON.stringify(requestData));

                            request(optionsX, function (errorX, responseX, dataX) {

                                if (!errorX && responseX != undefined && responseX.statusCode == 200) {

                                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends response ',reqIdX,JSON.stringify(responseX.body));

                                    console.log("BODY_",JSON.stringify(responseX.body));
                                    socket.send(responseX.body);


                                }
                                else
                                {
                                    logger.error('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends error  ',reqIdX,JSON.stringify(errorX));
                                    socket.send(errorX);
                                }
                            });
                        }

                    });
                }



            }).catch(function(err)
            {
                logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - [PGSQL] - Error occurred while searching for Application %s  ',reqIdX,data.AppID,err);
            });




        }

    });
});

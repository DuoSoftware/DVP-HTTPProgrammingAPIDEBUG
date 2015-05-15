
var request = require('request');
var Dbcon=require('DVP-DBModels');
var config=require('config');
var io = require('socket.io')(config.Socket.port);
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var uuid = require('node-uuid');

var IsCreated=false;

io.on('connection', function (socket) {
    var reqId='';

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
        // log.info("\n.............................................File Uploding Starts....................................................\n");
        // log.info("Upload params  :- ComapnyId : "+req.params.cmp+" TenentId : "+req.params.ten+" Provision : "+req.params.prov);
        logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Connection Starts  ',reqId);


        socket.on('message', function (dataz) {

            var reqIdX='';

            try
            {
                reqIdX = uuid.v1();
            }
            catch(ex)
            {

            }
        var data=JSON.parse(dataz);
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket received data  %s',reqIdX,data);
        if(IsCreated)
        {
            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket is already started  ',reqIdX);

            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: data};


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
            Dbcon.Application.find({where:{id:data.AppID}}).complete(function(err,result) {
                if (err) {
                    //console.log(err);
                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - [PGSQL] - Error occurred while searching for Application %s  ',reqIdX,data.AppID,err);
                }
                else {
                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - [PGSQL] - Records for Application %s  ',reqIdX,data.AppID,err);
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

                    var options = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/create", method: "POST", json: createData};
                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   HTTP request creation Data ',reqIdX,JSON.stringify(createData));

                    // console.log(data);
                    request(options, function (error, response, data) {

                        if (!error && response != undefined && response.statusCode == 200) {

                            sessionid = response.body;

                            var requestData = {
                             "session_id": sessionid,
                             "Caller-Direction": data.Caller_Direction,
                             "Caller-Caller-ID-Number": data.Caller_Caller_ID_Number,
                             "Caller-Destination-Number": data.Caller_Destination_Number,
                             "Caller-Caller-ID-Name": data.Caller_Caller_ID_Name,
                             "result": data.result

                             };

                            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: requestData};
                            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] -   HTTP request push Data ',reqIdX,JSON.stringify(requestData));

                            request(optionsX, function (errorX, responseX, dataX) {

                                if (!errorX && responseX != undefined && responseX.statusCode == 200) {

                                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends response ',reqIdX,JSON.stringify(responseX.body));
                                    socket.send(responseX.body);


                                }
                                else
                                {
                                    logger.error('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Sends error  ',reqIdX,JSON.stringify(errorX));
                                    socket.send(errorX);
                                }
                            });
                        }
                        socket.on('disconnect', function () {

                            logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Disconnection starts  ',reqIdX);
                            console.log('disconnect');

                            console.log(data);

                            data["exiting"] = "true";

                            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: data};


                            request(optionsX, function (errorX, responseX, dataX) {

                                if (!errorX && responseX != undefined && responseX.statusCode == 200) {

                                    logger.debug('[DVP-HTTPProgrammingAPIDEBUG] - [%s] - [SOCKET] - Socket Disconnection request sends successfully   %s',reqIdX,JSON.stringify(responseX.body));
                                    socket.send(responseX.body);


                                }
                            });

                        });
                    });

                }
            });
        }
    });
});
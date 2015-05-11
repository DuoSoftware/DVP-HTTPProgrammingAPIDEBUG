
var request = require('request');
var Dbcon=require('DVP-DBModels');
var config=require('config');
var io = require('socket.io')(config.Socket.port);

var IsCreated=false;

io.on('connection', function (socket) {

    socket.on('message', function (dataz) {

        var data=JSON.parse(dataz);
        if(IsCreated)
        {
            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: data};


            request(optionsX, function (errorX, responseX, dataX) {

                if (!errorX && responseX != undefined && responseX.statusCode == 200) {


                    socket.send(responseX.body);


                }else
                {
                    socket.send(errorX);
                }
            });
        }
        else
        {
            Dbcon.Application.find({where:{id:data.AppID}}).complete(function(err,result) {
                if (err) {
                    console.log(err);
                }
                else {
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

                             }

                            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: requestData};


                            request(optionsX, function (errorX, responseX, dataX) {

                                if (!errorX && responseX != undefined && responseX.statusCode == 200) {


                                    socket.send(responseX.body);


                                }
                                else
                                {
                                    socket.send(errorX);
                                }
                            });
                        }
                        socket.on('disconnect', function () {


                            console.log('disconnect');

                            console.log(data);

                            data["exiting"] = "true";

                            var optionsX = {url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: data};


                            request(optionsX, function (errorX, responseX, dataX) {

                                if (!errorX && responseX != undefined && responseX.statusCode == 200) {


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
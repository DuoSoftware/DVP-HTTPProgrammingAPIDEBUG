var io = require('socket.io')(8088);
//var io = require('socket.io');
var request = require('request');
var Dbcon=require('DVP-DBModels');
var config=require('config');

//io.listen(8088, '127.0.0.1');


io.on('connection', function (socket) {

    var sessionid = '';
/*
    var createData = {
        "url": "http://localhost/ivr/index.json",
        "company": 1,
        "tenent": 3,
        "pbx": "none",
        "appid": "1111",
        "domain": "192.168.8.100",
        "profile": "default"
    };
*/

    //var options = { url: "http://127.0.0.1:8086/debug/create", method: "POST", json: createData };


            socket.on('message', function (data) {


               console.log(data);



                var Dt=JSON.parse(data);

                Dbcon.Application.find({where:{id:Dt.AppID}}).complete(function(err,result)
                {
                    if(err)
                    {

                    }
                    else
                    {
                        var createData = {
                            "url": result.Url,
                            "company": result.CompanyId,
                            "tenent":result.TenantId,
                            "pbx": "none",
                            "appid": result.id,
                            "domain": "192.168.8.100",
                            "profile": "default"
                        };

                        var options = { url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/create", method: "POST", json: createData };

                        request(options, function (error, response, data) {

                            if(!error && response != undefined && response.statusCode == 200) {


                                var optionsX = { url: config.HTTPServer.ip+":"+config.HTTPServer.port+"/debug/push", method: "POST", json: data };


                                request(optionsX, function (errorX, responseX, dataX) {

                                    if(!errorX && responseX != undefined && responseX.statusCode == 200) {


                                        socket.send(responseX.body);




                                    }});


                            }});






                    }

                });








            });
            socket.on('disconnect', function () {


                console.log('disconnect');

               // console.log(data);

                //requestData["exiting"] = "true";
/*
                var optionsX = { url: "http://127.0.0.1:8086/debug/push", method: "POST", json: requestData };



                request(optionsX, function (errorX, responseX, dataX) {

                    if(!errorX && responseX != undefined && responseX.statusCode == 200) {


                        socket.send(responseX.body);




                    }});
*/
            });


});

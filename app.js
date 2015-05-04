var io = require('socket.io')(8088);
var request = require('request');

io.on('connection', function (socket) {

    var sessionid = '';

    var createData = {
        "url": "http://localhost/ivr/index.json",
        "company": 1,
        "tenent": 3,
        "pbx": "none",
        "appid": "1111",
        "domain": "192.168.8.100",
        "profile": "default"
    };


    var options = { url: "http://127.0.0.1:8086/debug/create", method: "POST", json: createData };



    request(options, function (error, response, data) {

        if(!error && response != undefined && response.statusCode == 200) {

            sessionid = response.body;

            var requestData = {
                "session_id": sessionid,
                "Caller-Direction": "inbound",
                "Caller-Caller-ID-Number": "123456",
                "Caller-Destination-Number": "12345",
                "Caller-Caller-ID-Name": "1234",
                "result": "test"

            }


            socket.on('message', function (data) {


               // console.log(data);

                var optionsX = { url: "http://127.0.0.1:8086/debug/push", method: "POST", json: requestData };



                request(optionsX, function (errorX, responseX, dataX) {

                    if(!errorX && responseX != undefined && responseX.statusCode == 200) {


                        socket.send(responseX.body);




                    }});

            });
            socket.on('disconnect', function () {


                console.log('disconnect');

                console.log(data);

                requestData["exiting"] = "true";

                var optionsX = { url: "http://127.0.0.1:8086/debug/push", method: "POST", json: requestData };



                request(optionsX, function (errorX, responseX, dataX) {

                    if(!errorX && responseX != undefined && responseX.statusCode == 200) {


                        socket.send(responseX.body);




                    }});

            });
        }
    });
});

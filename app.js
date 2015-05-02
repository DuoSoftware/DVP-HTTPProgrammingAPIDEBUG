var io = require('socket.io')(8088);

io.on('connection', function (socket) {


    socket.on('message', function (data) {


        console.log(data);

    });
    socket.on('disconnect', function () {



        console.log('disconnect');

    });
});

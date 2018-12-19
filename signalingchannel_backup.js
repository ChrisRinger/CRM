const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const dateFormat = require('dateformat');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/npm', express.static('node_modules'));
app.use(express.static('chat'));

// app.get('/', function(req, res){
//     res.send('Connected');
// });

// app.get('/nd-room', function(req, res){
//     res.sendFile(__dirname + '/chat/nd_room.html');
// });

http.listen(8181, function(){
    console.log('Example app listening on port 8181!');
});

// Let's start managing connections...
io.sockets.on('connection', function (socket){

    // Handle 'message' messages
    socket.on('message', function (message) {
        log('S --> got message: ', message);
        // channel-only broadcast...
        socket.broadcast.to(message.channel).emit('message', message);
    });

    // Handle 'create or join' messages
    socket.on('create or join', function (room) {
        var numClients = io.sockets.clients(room).length;

        log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
        log('S --> Request to create or join room', room);

        // First client joining...
        if (numClients == 0){
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            // Second client joining...
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else { // max two clients
            socket.emit('full', room);
        }
    });

    function log(){
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }
});
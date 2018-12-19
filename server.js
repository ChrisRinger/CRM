const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const dateFormat = require('dateformat');

const channelCustomerService = io.of('/customer-service');
const channelSupport = io.of('/support');

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

http.listen(3000, function(){
    console.log('Example app listening on port 3000!');
});

let messages = [];
let users = [];

io.on('connection', function(socket){
    console.log('New connection from anonymous. Socket ID: '  + socket.id);

    socket.on('disconnect', function(){
        users = users.filter(function(user){
            return user.socketID != socket.id;
        });
        console.log('User disconnected. User ID: ' + socket.id );
        io.emit('update-users', users);
    });
});

io.to('home').emit('Home');


channelCustomerService.on('connection', function(socket){

    let messages_customerService = [];
    let users_customerService = [];

    console.log('User connected to customer service channel');

    socket.emit('init-chat', messages_customerService);
    socket.emit('update-users', users_customerService);

    socket.on('send-message', function(payload){
        let newMessage = {text: payload.message, user: payload.user, date: 'Customer Service' };
        messages_customerService.push(newMessage);
        console.log(newMessage);
        io.emit('read-msg', newMessage);
    });

    socket.on('key-press', function() {
        console.log('User is typing');
        io.emit('s-key-press');
    });

    socket.on('key-up', function() {
        console.log('User stopped typing');
        io.emit('s-key-up');
    });

    socket.on('add-user', function(payload){
        users_customerService.push({ socketID : socket.id, userID : payload.id, channel : payload.channel, name : payload.name });
        console.log('New user ' + payload.name + ' connected. Socket ID: ' + socket.id + ' - User ID: ' + payload.id + ' - /nUser connected to: ' + payload.channel);
        io.emit('update-users', users_customerService);
    });
    // socket.join('First room');

});
// nd_room.emit('Hello there!');
//
// nd_room.to('First room').emit('Welcome in First room!');


channelSupport.on('connection', function(socket){

    let messages_support = [];
    let users_support = [];

    console.log('User connected to support channel');

    socket.emit('init-chat', messages_support);
    socket.emit('update-users', users_support);

    socket.on('send-message', function(payload){
        let newMessage = { text : payload.message, user : payload.user, date : 'Support' };
        messages_support.push(newMessage);
        console.log(newMessage);
        io.emit('read-msg', newMessage);
    });

    socket.on('key-press', function() {
        console.log('User is typing');
        io.emit('s-key-press');
    });

    socket.on('key-up', function() {
        console.log('User stopped typing');
        io.emit('s-key-up');
    });

    socket.on('add-user', function(payload){
        users_support.push({ socketID : socket.id, userID : payload.id, channel : payload.channel, name : payload.name });
        console.log('New user ' + payload.name + ' connected. Socket ID: ' + socket.id + ' - User ID: ' + payload.id + ' - /nUser connected to: ' + payload.channel);
        io.emit('update-users', users_support);
    });
    // socket.join('First room');

});


var io = require('socket.io-client');
var socket;

var Socket = {};

Socket.emit = function(type, data){
    return socket.emit(type, data);
}

Socket.on = function(type, callback){
    socket.on(type, callback);
}

;(function(){
    socket = io();

    console.log('Establishing connection with the server...');

    socket.on('connect_error',function(err){
		console.log('Could not connect to server.');
    });
    
	socket.on('error',function(err){
        console.log('Could not connect to server.');
	});
}())

module.exports = Socket;
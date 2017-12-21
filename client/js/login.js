var Socket = require('./socket'),
    Types = require('../../shared/js/types');

var Login = {};

Login.init = function(){
    $('#signin').submit(function(e){
        e.preventDefault();
        Login.in();
        return false;
    });

    Socket.on(Types.Messages.LOGIN, function(data){
        $('#logging-in').addClass('hidden');
        console.log(data)
        if(!data.success) $('#login-failed').removeClass('hidden');
    });
}

Login.in = function(){
    var username = $('#username').val(),
        password = $('#password').val()
    var data = {
        "username": username,
        "password": password
    }

    Socket.emit(Types.Messages.LOGIN, data);

    $('#login-failed').addClass('hidden');
    $('#logging-in').removeClass('hidden');
}

module.exports = Login;
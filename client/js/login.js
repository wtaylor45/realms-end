var Socket = require('./socket'),
    Types = require('../../shared/js/types');

var Login = {};

Login.init = function(){
    $('#signin').submit(function(e){
        e.preventDefault();
        Login.in();
        return false;
    });
}

Login.in = function(){
    var username = $('#username').val(),
        password = $('#password').val()
    var data = {
        "username": username,
        "password": password
    }
    console.debug('Attemption to login user',username,'...');

    Socket.emit(Types.Messages.LOGIN, data);
}

module.exports = Login;
var Socket = require('./socket'),
    Types = require('../../shared/js/types');

var Login = {};

Login.init = function(){
    $('#signin').submit(function(e){
        console.log(':)')
        e.preventDefault();
        console.log('Sign in?')
        Login.in();
        return false;
    });
}

Login.in = function(){
    var username = $('#username').value,
        password = $('#password').value
    var data = {
        "username": username,
        "password": password
    }

    Socket.emit(Types.Messages.LOGIN, data);
}

module.exports = Login;
var Socket = require('./socket'),
    Types = require('../../shared/js/types');

var Login = {};

Login.init = function(){
    $('#login').submit(function(e){
        e.preventDefault();
        Login.in();
        return false;
    })

    $('#show-login').click(function(e){
        e.preventDefault();
        Login.showForm('login');
        return false;
    })

    $('#show-register').click(function(e){
        e.preventDefault();
        Login.showForm('register');
        return false;
    })

    $('#show-login').click();

    Socket.on(Types.Messages.LOGIN, function(data){
        $('#logging-in').hide();
        console.log(data)
        if(!data.success) $('#login-failed').show();
    });
}

Login.in = function(){
    var username = $('#login-username').val(),
        password = $('#login-password').val()
    var data = {
        "username": username,
        "password": password
    }
    console.log('test')
    Socket.emit(Types.Messages.LOGIN, data);

    $('#login-failed').hide();
    $('#logging-in').show();
}

Login.showForm = function(form){
    if(!$('#show-'+form).hasClass('active')){
        $('#show-'+form).addClass('active');
        $('#login-failed').hide();
    }
    switch(form){
        case 'login':
            $('#login').show();
            $('#register').hide();
            $('#show-register').removeClass('active');
            break;
        case 'register':
            $('#login').hide();
            $('#login-failed').hide();
            $('#show-login').removeClass('active');
            $('#register').show();
            break;
        default:
            break;
    }
}

module.exports = Login;
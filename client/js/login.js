var Socket = require('./socket'),
    Types = require('../../shared/js/types');

var Login = {};

var usernameRegex = /^(?=.{1,20})[a-zA-Z0-9\-_.]+$/;;
var emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    passwordRegex = /^(?=.{8,})/

Login.init = function(){
    $('#login').submit(function(e){
        e.preventDefault();
        Login.in();
        return false;
    })

    $('#register').submit(function(e){
        e.preventDefault();
        Login.register();
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
        if(!data.success){
            $('#login-failed').show();
            return false;
        } 

        Login.success();
    });

    Socket.on(Types.Messages.REGISTER, function(data){
        console.log(data)
        if(!data.success){
            $('#register-failed').html(data.reason);
            $('#register-failed').show();
            return false;
        } 

        Login.success();
    });
}

Login.in = function(){
    var username = $('#login-username').val(),
        password = $('#login-password').val()
    var data = {
        "username": username,
        "password": password
    }
    Socket.emit(Types.Messages.LOGIN, data);

    $('#login-failed').hide();
    $('#logging-in').show();
}

Login.register = function(){
    var username = $('#register-username').val(),
        password = $('#register-password').val(),
        confirmation = $('#register-confirm').val(),
        email = $('#register-email').val();
    
    if(!Login.validateRegistration(username, email, password, confirmation)){
        return;
    }

    var data = {
        "username": username,
        "password": password,
        "email": email
    }
    Socket.emit(Types.Messages.REGISTER, data);

    $('#register-failed').hide();
}

Login.validateRegistration = function(username, email, password, confirmation){
    if(!usernameRegex.test(username)){
        $('#register-failed').html("Invalid username. Please only use a-Z, 0-9, '_', '-', or '.'.");
        $('#register-failed').show();
        return false;
    }
    if(!passwordRegex.test(password)){
        console.log(password)
        $('#register-failed').html("Password must be at least 8 characters long.");
        $('#register-failed').show();
        return false;
    }
    if(confirmation != password){
        $('#register-failed').html("Passwords must match.");
        $('#register-failed').show();
        return false();
    }

    if(!emailRegex.test(email)){
        $('#register-failed').html("Invalid email address.");
        $('#register-failed').show();
        return false;
    }

    return true;
}

Login.success = function(){

}

Login.showForm = function(form){
    if(!$('#show-'+form).hasClass('active')){
        $('#show-'+form).addClass('active');
        $('#login-failed').hide();
        $('#register-failed').hide();
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
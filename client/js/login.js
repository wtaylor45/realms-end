var Socket = require('./socket'),
    Types = require('../../shared/js/types'),
    Game = require('./game');

var Login = {};

var usernameRegex = /^(?=.{1,20})[a-zA-Z0-9\-_.]+$/;;
var emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    passwordRegex = /^(?=.{8,})/
var LAST_CLICK = 0, DELAY=500;

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
        Login.handleResponse(data);
    });

    Socket.on(Types.Messages.REGISTER, function(data){
        Login.handleResponse(data);
    });
}

Login.in = function(){
    if(Date.now()-LAST_CLICK<DELAY) return;

    var username = $('#login-username').val(),
        password = $('#login-password').val()
    var data = {
        "username": username,
        "password": password
    }

    $('#show-login').prop("disabled", true);
    $('#show-register').prop("disabled", true);
    $('#submit-login').prop("disabled", true);

    Socket.emit(Types.Messages.LOGIN, data);

    $('#login-message').hide();

    LAST_CLICK = Date.now();
}

Login.handleResponse = function(data){
    if(!data.success){
        $('#login-message').html(formatMessage(data.reason, "failed"));
        $('#login-message').show();
        $('#show-login').prop("disabled", false);
        $('#show-register').prop("disabled", false);
        $('#submit-login').prop("disabled", false);
        $('#submit-register').prop("disabled", false);
    }else{
        $('#login-message').html(formatMessage(data.reason, "success"));
        $('#login-message').show();
        console.log(data.complete)
        if(data.complete){
            $('#startDiv').hide();
            new Game(data.playerData);
        }
    }
}

Login.register = function(){
    if(Date.now()-LAST_CLICK<DELAY) return;

    var username = $('#register-username').val(),
        password = $('#register-password').val(),
        confirmation = $('#register-confirm').val(),
        email = $('#register-email').val();

    if(!Login.validateRegistration(username, email, password, confirmation)){
        return;
    }

    $('#show-login').prop("disabled", true);
    $('#show-register').prop("disabled", true);
    $('#submit-register').prop("disabled", true);

    var data = {
        "username": username,
        "password": password,
        "email": email
    }
    Socket.emit(Types.Messages.REGISTER, data);

    $('#register-message').hide();

    LAST_CLICK = Date.now();
}

Login.validateRegistration = function(username, email, password, confirmation){
    if(!usernameRegex.test(username)){
        $('#register-message').html(formatMessage("Invalid username. Please only use a-Z, 0-9, '_', '-', or '.'.", "failed"));
        $('#register-message').show();
        return false;
    }
    if(!passwordRegex.test(password)){
        $('#register-message').html(formatMessage("Password must be at least 8 characters long.", "failed"));
        $('#register-message').show();
        return false;
    }
    if(confirmation != password){
        $('#register-message').html(formatMessage("Passwords must match.", "failed"));
        $('#register-message').show();
        return false;
    }

    if(!emailRegex.test(email)){
        $('#register-message').html(formatMessage("Invalid email address.","failed"));
        $('#register-message').show();
        return false;
    }

    return true;
}

Login.showForm = function(form){
    if(!$('#show-'+form).hasClass('active')){
        $('#show-'+form).addClass('active');
        $('#login-message').hide();
        $('#register-message').hide();
    }
    switch(form){
        case 'login':
            $('#login').show();
            $('#register').hide();
            $('#show-register').removeClass('active');
            break;
        case 'register':
            $('#login').hide();
            $('#login-message').hide();
            $('#show-login').removeClass('active');
            $('#register').show();
            break;
        default:
            break;
    }
}

function formatMessage(message, type){
    return "<p class="+type+">"+message+"</p>";
}

module.exports = Login;

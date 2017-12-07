var _ = require('underscore'),
    Socket = require('./socket'),
    Login = require('./login');

(function(){
    $(document).ready(function(){
        Login.init();
    });
}())
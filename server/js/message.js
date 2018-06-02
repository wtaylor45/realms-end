var Types = require('../../shared/js/types'),
    Logger = require('js-logger')

module.exports = Message = {};

Message.Login = class Login {
    constructor(player, reason){
        this.player = player;
        this.reason = reason;
        this.type = Types.Messages.LOGIN;
    }

    serialize(){
        var message = {};
        if(this.player){
            message.success = true;
            message.complete = true;
            message.playerData = this.player.getState();
        }else{
            message.success = false;
            message.complete = false;
        }
        message.reason = this.reason;
        return message;
    }
}

Message.Login.Reasons = {
    CREDENTIALS_FAIL: "Invalid username or password.",
    LOGGED_IN_FAIL: "This account is already logged in to the game.",
    USERNAME_TAKEN_FAIL: "Username already in use.",
    REGISTER_SUCCESS: "Account registered succesfully. Entering the realm...",
    LOGIN_SUCCESS: "Successfully logged in. Entering the realm..."
}
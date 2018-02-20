var Types = require('../../shared/js/types');

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
            message.playerData = this.player.getState();
        }else{
            message.success = false;
        }
        message.reason = this.reason;
        return message;
    }
}
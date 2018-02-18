var Character = require('./character');

module.exports = Player = class Player extends Entity {
    constructor(username, connection, worldServer){
        super(connection.id);
        var self = this;
        this.username = username;
        this.connection = connection;
        this.worldServer = worldServer;

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }
}
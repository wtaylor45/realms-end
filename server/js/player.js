var Character = require('./character'),
    DB = require('./private/db'),
    Logger = require('js-logger')

module.exports = Player = class Player extends Character {
    constructor(id, username, x, y, map, connection, worldServer){
        super(id, username, x, y, map);
        var self = this;
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
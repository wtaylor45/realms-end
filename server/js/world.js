/*
 * Game server that handles all game logic, loops, etc
 */

var Logger = require('js-logger'),
    _ = require('underscore'),
    Player = require('./player'),
    DB = require('./private/db'),
    Types = require('../../shared/js/types.js'),
    Message = require('./message'),
    Types = require('../../shared/js/entityModel.js')

var worlds = [];

module.exports = World = class World{
    constructor(id, maxPlayers, server){
        var self = this;

        this.id = id;
        this.server = server;
        this.maxPlayers = maxPlayers;
        this.playerCount = 0;

        // The list of all entities, players, etc
        this.players = [];
        this.entities = [];

        // The message queue for each player
        this.outgoingMessages = {};
        
        this.onPlayerConnect(function(player){
            self.incrementPlayerCount();

            // Sets the player online
            DB.updateEntry(DB.USERS, {username: player.username}, {$set: {online: true}});
            
            Logger.info("Player", player.name, "added.");
            Logger.info(self.id, "capacity:",
                self.playerCount+"/"+self.maxPlayers);
            
            player.onDisconnect(function(){
                self.removePlayer(player);
                self.decrementPlayerCount();
                DB.updateEntry(DB.USERS, {username: player.username}, {$set: {online: false}});

                Logger.info("Player", player.id,"removed.") 
                Logger.info(self.id, "capacity:",
                    self.playerCount+"/"+self.maxPlayers);
            });

            player.onBroadcast(function(message){
                self.broadcastMessageToZone(player, message.serialize());
            });

            self.outgoingMessages[player.id] = [];
        });
    }

    connectPlayer(player){
        this.connectCallback(player)
    }

    onPlayerConnect(callback){
        this.connectCallback = callback;
    }

    incrementPlayerCount(){
        this.playerCount++;
    }

    decrementPlayerCount(){
        this.playerCount--;

        if(this.playerCount < 0){
            Logger.error("ERROR: Player count currently", this.playerCount
                +". Player counts should never fall below 0.");
        }
    }

    addEntity(entity){
        this.entities[entity.id] = entity;
    }

    removeEntity(entity){
        delete this.entities[entity.id];
    }

    addPlayer(player){
        this.players[player.id] = player;
        this.outgoingMessages[player.id] = [];
    }

    removePlayer(player){
        delete this.players[player.id];
        delete this.outgoingMessages[player.id];

        this.removeEntity(player);
    }

    broadcastMessageToZone(entity, message){
        //var playersInZone = this.getPlayersWithinBounds(entity.getZoneBounds());
        var playersInZone = this.players;
        var self = this;
        _.forEach(playersInZone, function(player){
            self.addMessageToOutbox(player, message);
        });
    }

    addMessageToOutbox(player, message){
        this.outgoingMessages[player.id].push(message);
    }
}

World.createWorlds = function(numWorlds, playersPerWorld, server){
    _.each(_.range(numWorlds), function(i){
        worlds[i] = new World("world"+(i+1), playersPerWorld, server);
        Logger.info('World', i, 'created.')
    });
}

World.addPlayerToOpenWorld = function(data, connection){
    var world = _.detect(worlds, function(world){
        return world.playerCount < world.maxPlayers;
    });

    if(!world){
        Logger.info("All worlds currently full.");
    }else{
        world.connectPlayer(new Player(data._id, data.username, data.x, data.y, 
            data.map, connection, world));            
    }
}
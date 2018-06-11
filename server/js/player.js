var Character = require('./character'),
    DB = require('./private/db'),
    Logger = require('js-logger'),
    Message = require('./message'),
    Types = require('../../shared/js/types'),
    Races = require('../../shared/js/races'),
    PlayerModel = require('../../shared/js/playerModel'),
    _ = require('underscore')

module.exports = Player = class Player extends Character {
    constructor(id, username, x, y, mapName, connection, worldServer){
        super(id, username, x, y, mapName);
        var self = this;
        this.connection = connection;
        this.worldServer = worldServer;

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });

        this.onLoaded(function(){
            var message = new Message.Login(self, Message.Login.Reasons.LOGIN_SUCCESS);
            self.connection.emit(
                message.type, 
                message.serialize()
            );
        });

        this.init(); // Initialize other parts of players
    }

    init(){
        var self=this;
        var readyFlags = {
            statsReady: false,
            locationReady: false
        }
        this.initializeStats(function(){
            readyFlags.statsReady = true;
        });
        this.initializeLocation(function(){
            readyFlags.locationReady = true;
        });

        // Continuosly check for all ready flags to be set to true
        var onReady = setInterval(function(){
            if(!_.contains(readyFlags, false)){
                clearInterval(onReady);
                self.initializeListeners();
                self.loaded();
            }
        }, 10);
    }

    initializeStats(callback){
        var self = this;
        DB.findOne(DB.STATS, {userId: this.id}, function(result){
            // Prune the result object
            delete result.userId;
            delete result._id;
            
            if(!result){
                Logger.info("No stats for", self.name, "found. Creating their statistics...");
                result = Player.setBaseStatsFromRace(Types.Races.HUMAN);
                result.userId = self.id;
                DB.writeToTable(DB.STATS, result);
            }

            self.setStats(result);
            if(callback) callback();
        });
    }

    initializeLocation(callback){
        var self = this;
        // Get the users location from the database
        DB.findOne(DB.LOCATION, {userId: this.id}, function(result){
            if(!result){
                Logger.warn("No location found for "+self.name+". Setting to base location for this users race ("+Types.Races.HUMAN+").");
                result = Player.setBaseLocationFromRace(Types.Races.HUMAN);
                result.userId = self.id;
                DB.writeToTable(DB.LOCATION, result);
            }

            self.setLocation(result.x, result.y, result.map);
            if(callback) callback();
        });
    }

    initializeListeners(){
        var self = this;
        this.connection.on(Types.Messages.MOVE, function(data){
            self.onMove(data);
        });
    }

    loaded(){
        if(this.loadCallback) this.loadCallback();
    }

    onLoaded(callback){
        this.loadCallback = callback;
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }

    broadcast(message){
        if(this.broadcastCallback){
            this.broadcastCallback(message);
        }
    }

    onBroadcast(callback){
        this.broadcastCallback = callback;
    }

    onMove(data){
        var position = PlayerModel.move(this, data.vector, data.dt);
        this.setPosition(position[0], position[1]);
        var message = new Message.Move(this, data.sequenceNumber);
        this.broadcast(message);
    }
}

Player.createNewPlayer = function(username, callback){
    // Write Stats
    var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);
    var location = Player.setBaseLocationFromRace(Types.Races.HUMAN);
    var statsReady, locationReady;

    DB.findOne(DB.USERS, {username: username}, function(result){
        stats.userId = result._id;
        location.userId = result._id;
        DB.writeToTable(DB.STATS, stats, function(){
            statsReady = true;
        });
        DB.writeToTable(DB.LOCATION, location, function(){
            locationReady = true;
        });
    });

    var onReady = setInterval(function(){
        if(statsReady && locationReady){
            cancelInterval(onReady);
            callback();
        }
    }, 10);
}

Player.setBaseStatsFromRace = function(race){
    var stats = PlayerModel.STATS;
    var raceStats = Races.getBaseStats(race);
    stats.curHealth = stats.maxHealth = raceStats.health;
    stats.curSpeed = stats.maxSpeed = raceStats.speed;
    return stats;
}

Player.setBaseLocationFromRace = function(race){
    var raceLocation = Races.getBaseLocation(race);
    return raceLocation;
}
var Character = require('./character'),
    DB = require('./private/db'),
    Logger = require('js-logger'),
    Message = require('./message'),
    Types = require('../../shared/js/types'),
    Races = require('../../shared/js/races'),
    PlayerModel = require('../../shared/js/playerModel')

module.exports = Player = class Player extends Character {
    constructor(id, username, x, y, map, connection, worldServer){
        super(id, username, x, y, map);
        var self = this;
        this.connection = connection;
        this.worldServer = worldServer;
        this.model = new PlayerModel(this);

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });

        this.onLoaded(function(){
            var message = new Message.Login(self);
            self.connection.emit(
                message.type, 
                message.serialize()
            );
        });

        this.init(); // Initialize other parts of players
    }

    init(){
        var self=this;
        var statsReady, locationReady;
        this.initializeStats(function(){
            statsReady = true;
        });
        this.initializeLocation(function(){
            locationReady = true;
        });

        var onReady = setInterval(function(){
            if(statsReady && locationReady){
                cancelInterval(onReady);
                self.initializeListeners();
            }
        }, 10);
    }

    initializeStats(callback){
        var self = this;
        DB.findOne(DB.STATS, {userId: this.id}, function(result){
            if(!result){
                Logger.warn("No stats for", self.name, "found. Creating their statistics...");
                var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);
                stats.userId = self.id;
                return DB.writeToTable(DB.STATS, stats, callback);
            }

            delete result.userId;
            delete result._id;

            self.setStats(result);
            if(callback) callback();
        });
    }

    initializeLocation(callback){
        var self = this;
        DB.findOne(DB.LOCATION, {userId: this.id}, function(result){
            if(!result){
                Logger.warn("No location found. Setting to base location...");
                var location = Player.setBaseLocationFromRace();
                location.userId = self.id;
                return DB.writeToTable(DB.LOCATION, location, callback);
            }
        });


    }
    

    initializeListeners(){
        var self = this;
        this.connection.on(Types.Messages.MOVE, function(data){
            self.onMove(data);
        });
    }

    onLoaded(callback){
        this.loadCallback = callback;
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }

    onMove(data){
        this.model.move(data.vector, data.dt);
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
    var stats = DB.STATS_SCHEMA;
    var raceStats = Races.getBaseStats(race);
    stats.curHealth = stats.maxHealth = raceStats.health;
    stats.curSpeed = stats.maxSpeed = raceStats.speed;
    return stats;
}

Player.setBaseLocationFromRace = function(race){
    var raceLocation = Races.getBaseLocation(race);
    return raceLocation;
}
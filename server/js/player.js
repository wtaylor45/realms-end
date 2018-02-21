var Character = require('./character'),
    DB = require('./private/db'),
    Logger = require('js-logger'),
    Types = require('../../shared/js/types'),
    Races = require('../../shared/js/races')

module.exports = Player = class Player extends Character {
    constructor(id, username, x, y, map, connection, worldServer){
        super(id, username, x, y, map);
        var self = this;
        this.connection = connection;
        this.worldServer = worldServer;

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });

        this.init(); // Initialize other parts of players
    }

    init(){
        var self = this;
        DB.findOne(DB.STATS, {userId: this.id}, function(result){
            Logger.debug(self.id);
            self.setStats(result);
        });
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }
}

Player.createNewPlayer = function(username, callback){
    // Write Stats
    var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);

    DB.findOne(DB.USERS, {username: username}, function(result){
        stats.userId = result._id;
        DB.writeToTable(DB.STATS, stats, callback);
    });
}

Player.setBaseStatsFromRace = function(race){
    var stats = DB.STATS_SCHEMA;
    var raceStats = Races.getBaseStats(race);
    stats.curHealth = stats.maxHealth = raceStats.health;
    stats.curSpeed = stats.maxSpeed = raceStats.speed;
    return stats;
}
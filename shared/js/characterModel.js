var EntityModel = require('./entityModel'),
    Logger = require('js-logger'),
    _ = require('underscore')

module.exports = CharacterModel = {};
    
CharacterModel.getStats = function(character){
    return character.stats;
}

CharacterModel.setStats = function(character, stats){
    var isInvalidStatsObject = _.contains(stats, null);
    if(isInvalidStatsObject){
        throw "The given stats object does not match the stats schema.";
    }
    character.stats = stats;
    Logger.info(character.name, "had stats updated to:", character.stats);
}

CharacterModel.STATS = {
    maxSpeed: null,
    curSpeed: null,
    maxHealth: null,
    curHealth: null
}
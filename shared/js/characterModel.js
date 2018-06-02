var EntityModel = require('./entityModel'),
    Logger = require('js-logger'),
    _ = require('underscore')

module.exports = CharacterModel = class CharacterModel extends EntityModel {
    constructor(character){
        super(character);
        this.character = character;
    }
    
    getStats(){
        return this.character.stats;
    }

    setStats(stats){
        var isInvalidStatsObject = _.contains(stats, null);
        if(isInvalidStatsObject){
            throw "The given stats object does not match the stats schema.";
        }
        this.character.stats = stats;
    }    
}

CharacterModel.STATS = {
    maxSpeed: null,
    curSpeed: null,
    maxHealth: null,
    curHealth: null
}
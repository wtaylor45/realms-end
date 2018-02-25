var EntityModel = require('./entityModel')

var STATS = {
    maxSpeed: null,
    curSpeed: null,
    maxHealth: null,
    curHealth: null
}

module.exports = CharacterModel = class CharacterModel extends EntityModel {
    constructor(character){
        super(character);
        this.character = character;
    }
    
    getStats(){
        return this.character.stats;
    }

    setStats(stats){
        var statsSchema = STATS;
        this.character.stats = stats;
    }    
}
var Entity = require('./entity'),
    Logger = require('js-logger'),
    CharacterModel = require('../../shared/js/characterModel')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, mapName){
        super(id, x, y, mapName);
        this.name = name;
        this.stats = CharacterModel.STATS_SCHEMA;
    }

    /**
     * Return the basic state information of the character.
     */
    getState(){
        var state = this.getBaseState();
        state.name = this.name;
        state.stats = this.getStats();
        return state;
    }

    /**
     * @param {Object} stats            The stats to set as the current statistics of the character.
     */
    setStats(stats){
        CharacterModel.setStats(this, stats);
    }

    getStats(){
        return CharacterModel.getStats(this);
    }  
}
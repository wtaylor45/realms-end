var Entity = require('./entity'),
    Logger = require('js-logger'),
    CharacterModel = require('../../shared/js/characterModel')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, map){
        super(id, x, y, map);
        this.name = name;
        this.model = new CharacterModel();
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
        this.model.setStats(stats);
    }

    getStats(){
        return this.model.getStats();
    }
       
}
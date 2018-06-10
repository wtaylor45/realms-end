var Entity = require('./entity'),
    Sprite = require('./sprite'),
    _ = require('underscore'),
    CharacterModel = require('../../shared/js/characterModel')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, sprite){
        super(id, x,y,sprite);
        this.name = name;
        this.stats = CharacterModel.STATS_SCHEMA
    }

    setStats(stats){
        CharacterModel.setStats(this, stats);
    }
}
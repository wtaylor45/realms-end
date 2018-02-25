var Entity = require('./entity'),
    Sprite = require('./sprite'),
    _ = require('underscore'),
    CharacterModel = require('../../shared/js/characterModel')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, sprite){
        super(id, x,y,sprite);
        this.name = name;
        this.model = new CharacterModel(this);
        this.stats = {}
    }

    setStats(stats){
        this.stats = stats;
    }
}
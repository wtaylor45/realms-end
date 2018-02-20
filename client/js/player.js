var Types = require('../../shared/js/types'),
    Character = require('./character'),
    Sprite = require('./sprite'),
    Map = require('./mapClient')

module.exports = Player = class Player extends Character {
    constructor(name, x, y, map){
        super(x,y,Types.Sprites.PLAYER0);
        this.name = name;
        this.map = new Map(map);
    }

    setStats(stats){
        super.setStats(stats);
        this.maxSpeed = stats.maxSpeed;
        this.curSpeed = stats.curSpeed;
    }
}
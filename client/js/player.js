var Types = require('../../shared/js/types'),
    Character = require('./character'),
    Sprite = require('./sprite'),
    Map = require('./mapClient'),
    Input = require('./input')

module.exports = Player = class Player extends Character {
    constructor(name, x, y, map){
        super(x,y,Types.Sprites.PLAYER0);
        this.name = name;
        this.map = new Map(map);
        Input.init();
    }

    setStats(stats){
        super.setStats(stats);
        this.maxSpeed = stats.maxSpeed;
        this.curSpeed = stats.curSpeed;
    }

    update(dt){
        this.applyInputs(dt);
    }

    applyInputs(dt){
        var vector = Input.getVector();
        
        this.x += 150*dt*vector[0];
        this.y += 150*dt*vector[1];
    }
}
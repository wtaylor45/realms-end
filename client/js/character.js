var Entity = require('./entity'),
    Sprite = require('./sprite')

module.exports = Character = class Character extends Entity {
    constructor(x, y, sprite){
        super(x,y,sprite);
    }

    setStats(stats){
        this.maxHealth = stats.maxHealth;
        this.curHealth = stats.curHealth;
    }
}
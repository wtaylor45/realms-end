var Entity = require('./entity'),
    Sprite = require('./sprite')

module.exports = Character = class Character extends Entity {
    constructor(x, y, sprite){
        super(x,y,sprite);
        this.maxHealth = 100;
        this.curHealth = 100;
    }

    setStats(stats){
        this.maxHealth = stats.maxHealth;
        this.curHealth = stats.curHealth;
    }
}
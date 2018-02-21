var Entity = require('./entity'),
    Logger = require('js-logger')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, map){
        super(id, x, y, map);
        this.name = name;
        this.maxHealth = 100;
        this.curHealth = 100;
        this.maxSpeed = 10;
        this.curSpeed = 10;
    }

    getState(){
        var state = this.getBaseState();
        state.name = this.name;
        state.stats = this.getStats();
        return state;
    }

    getStats(){
        return {
            maxHealth: this.maxHealth,
            curHealth: this.curHealth,
            maxSpeed: this.maxSpeed,
            curSpeed: this.curSpeed
        }
    }

    setStats(stats){
        this.maxHealth = stats.maxHealth;
        this.curHealth = stats.curHealth;
        this.maxSpeed = stats.maxSpeed;
        this.curSpeed = stats.curSpeed;
        Logger.debug(stats);
    }
}
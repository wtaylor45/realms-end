var Entity = require('./entity'),
    Logger = require('js-logger')

module.exports = Character = class Character extends Entity {
    constructor(id, name, x, y, map){
        super(id, x, y, map);
        this.name = name;
        this.maxHealth = null;
        this.curHealth = null;
        this.maxSpeed = null;
        this.curSpeed = null;
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
    }
}
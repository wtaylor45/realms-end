var Logger = require('js-logger');

module.exports = Entity = class Entity {
    constructor(id, x, y, map){
        this.id = id;
        this.map = map;
        this.x = x;
        this.y = y;
    }

    getBaseState(){
        return {
            map: this.map,
            x: this.x,
            y: this.y
        }
    }


}
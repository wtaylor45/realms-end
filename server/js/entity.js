var Logger = require('js-logger'),
    EntityModel = require('../../shared/js/entityModel')


module.exports = Entity = class Entity {
    constructor(id, x, y, mapName){
        this.id = id;
        this.x = x;
        this.y = y;
        this.mapName = mapName;
    }

    /**
     * Get the barebones information that makes up the entity. Subclasses should call this in their
     * getState() methods.
     */
    getBaseState(){
        return {
            id: this.id,
            map: this.map,
            x: this.x,
            y: this.y
        }
    }

    setPosition(x, y){
        EntityModel.setPosition(this, x, y);
    }

    setLocation(x,y, map){
        EntityModel.setLocation(this, x, y, map);
    }
}
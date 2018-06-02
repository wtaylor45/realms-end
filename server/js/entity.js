var Logger = require('js-logger'),
    EntityModel = require('../../shared/js/entityModel')


module.exports = Entity = class Entity {
    constructor(id, x, y, map){
        this.id = id;
        this.model = new EntityModel(this);
        this.map = map;
        this.x = x;
        this.y = y;
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
}
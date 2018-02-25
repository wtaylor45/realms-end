

module.exports = EntityModel = class EntityModel {
    constructor(entity){
        this.entity = entity;
    }

    setPosition(x, y){
        this.entity.x = x;
        this.entity.y = y;
    }
}
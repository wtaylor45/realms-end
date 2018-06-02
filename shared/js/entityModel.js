

module.exports = EntityModel = {};

EntityModel.setPosition = function(entity, x, y){
    entity.x = x;
    entity.y = y;
}

EntityModel.setLocation = function(entity, x, y, map){
    this.setLocation(entity, x,y);
    character.map = map;
}


EntityModel = {};

EntityModel.setPosition = function(entity, x, y){
    entity.x = x;
    entity.y = y;
}

EntityModel.setLocation = function(entity, x, y, mapName){
    entity.x = x;
    entity.y = y;
    entity.mapName = mapName;
}

module.exports = EntityModel;

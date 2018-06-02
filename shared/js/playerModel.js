

module.exports = PlayerModel = {};

PlayerModel.move = function(player, vector, dt){
    var x = player.x+player.stats.curSpeed*dt*vector[0];
    var y = player.y+player.stats.curSpeed*dt*vector[1];
    
    this.setPosition(x, y);
}
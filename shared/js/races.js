var races = {
    human: require('../data/races/human.json')
}

module.exports = Races = {};

Races.getBaseStats = function(race){
    return races[race].stats;
}

Races.getBaseLocation = function(race){
    return {
        "map": races[race].map,
        "x": races[race].x,
        "y": races[race].y
    }
}
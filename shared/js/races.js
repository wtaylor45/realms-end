var races = {
    human: require('../data/races/human.json')
}

module.exports = Races = {};

Races.getBaseStats = function(race){
    return races[race].stats;
}
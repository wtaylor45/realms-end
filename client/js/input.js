var STATE = null;

module.exports = Input = {};

Input.init = function(){
    STATE = Input.baseState();
    document.onkeydown = function(e){
        var key = Input.getKeyName(e.which);
        if(!key) return;
        Input.setState(key, true);
    };
    document.onkeyup = function(e){
        var key = Input.getKeyName(e.which);
        if(!key) return;
        Input.setState(key, false);
    }
}

Input.baseState = function(){
    return {
        up: [false, 0],
        down: [false, 0],
        left: [false, 0],
        right: [false, 0]
    }
}

Input.getKeyName = function(key){
    switch(key){
        case 87:
            return "up";
        case 83:
            return "down";
        case 65:
            return "left";
        case 68:
            return "right";
        default:
            break;
    }
}

Input.setState = function(key, state){
    STATE[key] = [state, Date.now()];
}

Input.getState = function(){
    return STATE;
}

Input.getVector = function(){
    var vector = [0, 0];
    var state = Input.getState();
    
    if(state.up[0] && state.down[0]) vector[1] = state.up[1] > state.down[1]  ? -1 : 1;
    else{
        if(state.up[0]) vector[1]-=1;
        if(state.down[0]) vector[1]+=1;
    }

    if(state.left[0] && state.right[0]) vector[0] = state.left[1] > state.right[1]  ? -1 : 1;
    else{
        if(state.left[0]) vector[0]-=1;
        if(state.right[0]) vector[0]+=1;
    }

    return vector;
}
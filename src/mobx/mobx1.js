//import React, { Component } from 'react';
import {observable} from 'mobx';



const appState = observable({
      timer: 0
});

/*
function resetTimer(){
    appState.timer = 1000;
}
*/

function add_favourite(){
    return 1000;
}

function delete_favourite(){
    return 10;
}

appState.resetTimer = function(action) {
    console.log("ddd"+ action);
    //console.log("ffff" + )
    switch (action) {
        case 'ADD_FAVOURITE':
            return  appState.timer =  add_favourite ();//appState.timer = 1000;
        case 'DELETE_FAVOURITE':
            return  appState.timer =  delete_favourite (); //appState.timer = 100;
        default:
            return appState.timer;
    }
    //appState.timer = 1000;
};



/*setInterval(function() {
    appState.timer += 1;
}, 1000);
*/



export default appState
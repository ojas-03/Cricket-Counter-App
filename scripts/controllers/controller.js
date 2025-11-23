import { Service } from "../models/service.js";

window.addEventListener('load', init);

function init() {
    bindEvents();
}

var i = 0;


function bindEvents() {
    document.getElementById('DOT_Button').addEventListener('click', dotButton);
    document.getElementById('WIDE_Button').addEventListener('click', wideButton);
    document.getElementById('NO_BALL_Button').addEventListener('click', noBallButton);
    document.getElementById('1_Button').addEventListener('click', oneRunButton);
    document.getElementById('2_Button').addEventListener('click', twoRunsButton);
    document.getElementById('3_Button').addEventListener('click', threeRunsButton);
    document.getElementById('4_Button').addEventListener('click', fourRunsButton);
    document.getElementById('6_Button').addEventListener('click', sixRunsButton);
    document.getElementById('WICKET_Button').addEventListener('click', wicketButton);
    document.getElementById('Scoreboard_Button').addEventListener('click', scoreboardButton);
    document.getElementById('Target_Mode_Button').addEventListener('click', targetButton);
    document.getElementById('UNDO_Button').addEventListener('click', undoButton);   
}

function updateStatus(buttonID) {
    var statusButtons = ['firstStatusButton', 'secondStatusButton', 'thirdStatusButton', 'fourthStatusButton', 'fifthStatusButton', 'sixthStatusButton'];
    // {button : [render, runIncrement, overIncrement]}
    var correspondingActions = {'DOT_Button' : ['D', 0, 1], 'WIDE_Button' : ['W', 1, 0], 'NO_BALL_Button' : ['', 1, 0], '1_Button' : ['1', 1, 1], '2_Button' : ['2', 2, 1], '3_Button' : ['3', 3, 1], '4_Button' : ['4', 4, 1], '6_Button' : ['6', 6, 1], 'WICKET_Button' : ['W', 0, 1]};
    i = i % 6;
    document.getElementById(statusButtons[i]).innerText = correspondingActions[buttonID][0];
    i += correspondingActions[buttonID][2];
    console.log(i);

}

function dotButton() {
    updateStatus('DOT_Button');
    
    
}

function wideButton() {
    updateStatus('WIDE_Button');
}

function noBallButton() {
    updateStatus('NO_BALL_Button');
}

function oneRunButton() {
    updateStatus('1_Button');
}

function twoRunsButton() {
    updateStatus('2_Button');
}

function threeRunsButton() {
    updateStatus('3_Button');
}

function fourRunsButton() {
    updateStatus('4_Button');
}

function sixRunsButton() {
    updateStatus('6_Button');
}

function wicketButton() {
    updateStatus('WICKET_Button');
}

function scoreboardButton() {

}

function targetButton() {

}

function undoButton() {

}
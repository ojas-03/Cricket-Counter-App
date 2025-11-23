import { Service } from "../models/service.js";

window.addEventListener('load', init);

function init() {
    bindEvents();
}

var overCounter = 0;
var runCounter = 0;
var wicketCounter = 0;
var statusButtons = ['firstStatusButton', 'secondStatusButton', 'thirdStatusButton', 'fourthStatusButton', 'fifthStatusButton', 'sixthStatusButton'];
// {button : [render, runIncrement, overIncrement]}
var correspondingActions = {'DOT_Button' : ['D', 0, 1], 'WIDE_Button' : ['WIDE', 1, 0], 'NO_BALL_Button' : ['NB', 1, 0], '1_Button' : ['1', 1, 1], '2_Button' : ['2', 2, 1], '3_Button' : ['3', 3, 1], '4_Button' : ['4', 4, 1], '6_Button' : ['6', 6, 1], 'WICKET_Button' : ['W', 0, 1]};

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

let flag = false;
function updateStatus(buttonID) {
    if(flag) {
        resetButtons();
        flag = false;
    }
    document.getElementById(statusButtons[overCounter % 6]).innerText = correspondingActions[buttonID][0];
    runCountIncrement(buttonID);
    overCountIncrement(buttonID);
    printScore();
    if(overCounter%6 == 0) {
        flag = true;
    }
}

function runCountIncrement(buttonID) {
    runCounter += correspondingActions[buttonID][1];
    if(buttonID == 'WICKET_Button') {
        wicketCounter++;
    }
}

function overCountIncrement(buttonID) {
    overCounter += correspondingActions[buttonID][2];
}

function printScore() {
    // print runs/wickets
    document.getElementById('runCount').innerText = runCounter + '/' + wicketCounter;

    // print overs
    document.getElementById('overCount').innerText = Math.floor(overCounter/6) + '.' + overCounter%6;
}

function resetButtons() {
    console.log("Enter in reset button ", overCounter, overCounter%6);
    for(let buttonID of statusButtons) {
        document.getElementById(buttonID).innerText = '';
    }
}

function readAllFields() {

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
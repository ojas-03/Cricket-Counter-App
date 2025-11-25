import { Service } from "../models/service.js";

window.addEventListener('load', init);

function init() {
    bindEvents();
}

var overCount = 0;
var runCount = 0;
var wicketCount = 0;
var requiredRuns = 0;
var requiredBalls = 0;
var statusButtons = ['firstStatusButton', 'secondStatusButton', 'thirdStatusButton', 'fourthStatusButton', 'fifthStatusButton', 'sixthStatusButton'];
// {buttonID : [render, runIncrement, overIncrement]}
var correspondingActions = {'DOT_Button' : ['D', 0, 1], 'WIDE_Button' : ['WIDE', 1, 0], 'NO_BALL_Button' : ['NB', 1, 0], '1_Button' : ['1', 1, 1], '2_Button' : ['2', 2, 1], '3_Button' : ['3', 3, 1], '4_Button' : ['4', 4, 1], '6_Button' : ['6', 6, 1], 'WICKET_Button' : ['W', 0, 1]};

function bindEvents() {
    document.getElementById('DOT_Button').addEventListener('click', function() {updateStatus('DOT_Button');});
    document.getElementById('WIDE_Button').addEventListener('click', function() {updateStatus('WIDE_Button');});
    document.getElementById('NO_BALL_Button').addEventListener('click', function() {updateStatus('NO_BALL_Button');});
    document.getElementById('1_Button').addEventListener('click', function() {updateStatus('1_Button');});
    document.getElementById('2_Button').addEventListener('click', function() {updateStatus('2_Button');});
    document.getElementById('3_Button').addEventListener('click', function() {updateStatus('3_Button');});
    document.getElementById('4_Button').addEventListener('click', function() {updateStatus('4_Button');});
    document.getElementById('6_Button').addEventListener('click', function() {updateStatus('6_Button');});
    document.getElementById('WICKET_Button').addEventListener('click', function() {updateStatus('WICKET_Button');});
    document.getElementById('Scoreboard_Button').addEventListener('click', scoreboardButton);
    document.getElementById('Target_Mode_Button').addEventListener('click', targetButton);
    document.getElementById('popupTarget').addEventListener('click', closePopup);
    document.getElementById('submitTarget').addEventListener('click', submitTarget);
    document.getElementById('closeRequireBox').addEventListener('click', closeRequireBox);
    document.getElementById('UNDO_Button').addEventListener('click', undoButton);
}

let flag = false;
function updateStatus(buttonID) {
    if(wicketCount > 9)  return;
    if(flag) {
        resetButtons();
        flag = false;
    }
    document.getElementById(statusButtons[overCount % 6]).innerText = correspondingActions[buttonID][0];
    runCountIncrement(buttonID);
    overCountIncrement(buttonID);
    printScore();
    if(overCount%6 == 0) {
        flag = true;
    }
    addToScoreBoard(buttonID);
}

let extras = 0;
function readAllFields(buttonID) {
    if(buttonID == 'WIDE_Button' || buttonID == 'NO_BALL_Button') {
        extras += 1;
        return;
    }
    const runsObject = {};
    runsObject['runCount'] = correspondingActions[buttonID][0];
    runsObject['totalRunCount'] = runCount;
    runsObject['wicketCount'] = document.getElementById('wicketCount').innerText;
    runsObject['overCount'] = document.getElementById('overCount').innerText;
    runsObject['totalBallCount'] = overCount;
    runsObject['extras'] = extras;
    runsObject['statusButtonID'] = statusButtons[(overCount%6)-1];
    extras = 0;
    return runsObject;
}


function addToScoreBoard(buttonID) {
    const runsObject = readAllFields(buttonID);
    if(runsObject) Service.addRuns(runsObject);

}

function runCountIncrement(buttonID) {
    runCount += correspondingActions[buttonID][1];
    if(buttonID == 'WICKET_Button') {
        wicketCount++;
    }
}

function overCountIncrement(buttonID) {
    overCount += correspondingActions[buttonID][2];
}

let flagSubmit = false;
let gameOver = false;
function submitTarget() {
    const runsInput = document.getElementById('runsInput');
    const oversInput = document.getElementById('oversInput');
    requiredRuns = parseInt(runsInput.value) || 0;
    requiredBalls = parseInt(oversInput.value)*6 || 0;
    flagSubmit = true;
    gameOver = false;
    document.getElementById('requireBox').style.display = 'flex';
    document.getElementById('popupTarget').classList.remove('active');

    // Clear inputs for next use
    runsInput.value = '';
    oversInput.value = '';
    printScore();

}

function targetScoreCounter() {
    if(gameOver) return;
    
    const runsLeft = requiredRuns - runCount;
    const ballsLeft = requiredBalls - overCount; 
    
    // Update require-box with the values
    document.getElementById('requiredRuns').innerText = runsLeft;
    document.getElementById('requiredBalls').innerText = ballsLeft;
    
    if(runsLeft <= 0) {
        document.getElementById("requireBox").style.display = "none";
        document.getElementById('resultMessage').classList.add('show');
        document.getElementById('resultMessage').innerText = 'Congratulations !! You Won 🎉🎊';
        gameOver = true;
        flagSubmit = false;
    }
    else if(wicketCount > 9 || ballsLeft <= 0) {
        document.getElementById("requireBox").style.display = "none";
        document.getElementById('resultMessage').classList.add('show');
        document.getElementById('resultMessage').innerText = 'Alas !! You Lost 🥹😔';
        gameOver = true;
        flagSubmit = false;
    }
    else {
        document.getElementById('resultMessage').innerText = '';
        document.getElementById('resultMessage').classList.remove('show');
        document.getElementById("requireBox").style.display = "flex";
        gameOver = false;
    }
}

function printScore() {
    // print runs-wickets
    document.getElementById('runCount').innerText = runCount + ' /'; 
    document.getElementById('wicketCount').innerText = wicketCount;

    // print overs
    document.getElementById('overCount').innerText = Math.floor(overCount/6) + '.' + overCount%6;
    if(flagSubmit) targetScoreCounter();    
}


function resetButtons() {
    for(let buttonID of statusButtons) {
        document.getElementById(buttonID).innerText = '';
    }
}



function scoreboardButton() {
    

}

function printScoreCard(scoreObject) {
    const tbody = document.getElementById('scoreboard');
    const tr = tbody.insertRow();
    for(let key in scoreObject) {
        //if(key == '')
    }
}


function targetButton() {
    const popup = document.getElementById('popupTarget');
    popup.classList.add('active');
}

function closePopup(event) {
    // Only close if clicking on the background overlay, not the popup content
    console.log("close");
    if (event.target.id === 'popupTarget') {
        document.getElementById('popupTarget').classList.remove('active');
    }
}



function closeRequireBox() {
    document.getElementById("requireBox").style.display = "none";
    document.getElementById("resultMessage").style.display = "none";
}

function undoButton() {
    let obj = Service.retrieveLastRecord();
    document.getElementById(obj.statusButtonID).innerText = '';
    Service.overs.pop();
    obj = Service.retrieveLastRecord();
    runCount = obj.totalRunCount;
    overCount = obj.totalBallCount;
    printScore();

}
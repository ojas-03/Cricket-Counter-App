import { Service } from "../models/service.js";

window.addEventListener('load', init);

function init() {
    bindEvents();
    printScore();
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
    document.getElementById('popupScoreBoard').addEventListener('click', closePopup);
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
    if(overCount>=5 && overCount%6==0) {
        for(let i of statusButtons)  document.getElementById(i).innerText = '';
    }
    document.getElementById(statusButtons[overCount % 6]).innerText = correspondingActions[buttonID][0];
    runCountIncrement(buttonID);
    overCountIncrement(buttonID);
    printScore();
    if(overCount%6 == 0) {
        flag = true;
    }
    addToScoreBoard(buttonID);
    printScoreCard();
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
    if(overCount%6 == 0) runsObject['statusButtonID'] = statusButtons[5];
    else runsObject['statusButtonID'] = statusButtons[(overCount%6)-1];
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
    const popup = document.getElementById('popupScoreBoard');
    popup.classList.add('active');
    printScoreCard();
}

function printScoreCard() {
    const tbody = document.getElementById('scoreboard');
    if(!tbody) return;
    tbody.innerHTML = ''; // Clear existing rows
    
    const oversData = Service.overs;
    
    for(let i = 0; i < oversData.length; i++) {
        const obj = oversData[i];
        const tr = tbody.insertRow();
        
        // Over
        const tdOver = tr.insertCell();
        tdOver.innerText = obj.overCount;
        
        // Runs
        const tdRuns = tr.insertCell();
        tdRuns.innerText = obj.runCount;
        
        // Extras
        const tdExtras = tr.insertCell();
        tdExtras.innerText = obj.extras;
        
        // Total Score
        const tdTotal = tr.insertCell();
        tdTotal.innerText = `${obj.totalRunCount}/${obj.wicketCount}`;
    }
}


function targetButton() {
    const popup = document.getElementById('popupTarget');
    popup.classList.add('active');
}

function closePopup(event) {
    // Only close if clicking on the background overlay, not the popup content
    if (event.target.id === 'popupTarget') {
        document.getElementById('popupTarget').classList.remove('active');
    }
    if (event.target.id === 'popupScoreBoard') {
        document.getElementById('popupScoreBoard').classList.remove('active');
    }
}



function closeRequireBox() {
    document.getElementById("requireBox").style.display = "none";
    document.getElementById("resultMessage").style.display = "none";
}

function undoButton() {
    let obj = Service.retrieveLastRecord();
    if(obj) {
        document.getElementById(obj.statusButtonID).innerText = '';
        Service.overs.pop();
        obj = Service.retrieveLastRecord();
        if(obj) {
            runCount = obj.totalRunCount;
            wicketCount = obj.wicketCount;
            overCount = obj.totalBallCount;
            printScore();
            let resetArray = Service.statusButtonsReset();
            console.log(resetArray);
            for(let ele of resetArray) {
                document.getElementById(ele.statusButtonID).innerText = ele.runCount;
            }
        }
        else {
            runCount = 0;
            wicketCount = 0;
            overCount = 0;
            printScore();
        }
    }

}
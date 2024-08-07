const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');

const buttons = document.querySelectorAll('.block');
const tokens = document.querySelectorAll('.token');

const resetGame = document.querySelector('#resetgame');

const blackScore = document.querySelector('#score-p1');
const whiteScore = document.querySelector('#score-p2');

const winCont = document.querySelector('.winner');
const msg = document.querySelector('#msg');
const replay = document.querySelector('#replay');

let blackTurn = false;

let black = 0, white = 0;

changeFocus(player1, player2);
updateScores();

function changeFocus(butt1, butt2) {
    butt1.style.backgroundColor = 'rgb(19, 255, 19)';
    butt1.style.boxShadow = '0 0 15px springgreen';

    butt2.style.backgroundColor = 'green';
    butt2.style.boxShadow = 'none';
    
    blackTurn = !blackTurn;
}

function getDirections(source) {
    let first = Math.floor(source/10);          // Row Index
    let last = Math.floor(source%10);           // Column Index
    
    if(first === 0 || first === 1) {                // Row - 0 & 1
        if(last === 0 || last === 1) {                  // Column => 0 & 1
            return [10, 11, 1];                                 // Possible Directions = [Bottom, Bottom-Right, Right]
        } else if(last === 8 || last === 9) {           // Column => 8 & 9
            return [10, 9, -1];                                 // Possible Directions = [Bottom, Bottom-Left, Left]
        } else {                                        // Column => 2nd-7th
            return [1, 11, 10, 9, -1];                          // Possible Directions = [Right, Bottom-Right, Bottom, Bottom-Left, Left]
        }
    } else if(first === 8 || first === 9) {         // Row => 8 & 9
        if(last === 0 || last === 1) {                  // Columm => 0 & 1
            return [-10, -9, 1];                                // Possible Directions = [Top, Top-Right, Right]
        } else if(last === 8 || last === 9) {           // Column => 8 & 9
            return [-10, -11, -1];                              // Possible Directions = [Top, Top-Left, Left]
        } else {                                        // Column => 2nd-7th
            return [-1, -11, -10, -9, 1];                       // Possible Directions = [Left, Top-Left, Top, Top-Right, Right]
        }
    } else {                                        // Row => 2nd-7th
        if(last === 0 || last === 1) {                  // Columm => 0 & 1
            return [-10, -9, 1, 11, 10];                        // Possible Directions = [Top, Top-Right, Right, Bottom-Right, Bottom]
        } else if(last === 8 || last === 9) {           // Column => 8 & 9
            return [10, 9, -1, -11, -10];                       // Possible Directions = [Bottom, Bottom-Left, Left, Top-Left, Top]
        } else {                                        // Column => 2nd-7th
            return [-10, -9, 1, 11, 10, 9, -1, -11];            // Possible Directions = [Top, Top-Right, Right, Bottom-Right, Bottom, Bottom-Left, Left, Top-Left]
        }
    }
}

function checkTokens(source, color, dirs) {
    dirs.forEach((direction) => {
        let destination = searchToken(source, color, direction);
        if(destination !== -1) {
            invertTokens(source, destination, color, direction);
        }
    })
}

function searchToken(source, color, direction) {
    let row, col;
    
    for(let i = source+direction; ; i += direction) {
        if(window.getComputedStyle(tokens[i]).visibility === 'hidden') {
            return -1;
        }
        
        let bgColor = window.getComputedStyle(tokens[i]).backgroundColor;
        if(bgColor === color) {
            return i;
        }

        row = Math.floor(i/10);
        col = i%10;

        if(row === 0 && direction < -1) {
            return -1;
        }
        if(row === 9 && direction > 1) {
            return -1;
        }
        if((col === 0) && (direction === -11 || direction === -1 || direction === 9)) {
            return -1;
        }
        if((col === 9) && (direction === -9 || direction === 1 || direction === 11)) {
            return -1;
        }
    }
}

function invertTokens(source, destination, color, offset) {
    for(let i = source+offset; i !== destination; i += offset) {
        tokens[i].style.backgroundColor = color;
    }
}

function updateScores() {
    black = white = 0;
    for(let  i =  0; i <  100; i++) {
        if(window.getComputedStyle(tokens[i]).visibility === 'visible') {
            if(window.getComputedStyle(tokens[i]).backgroundColor === 'rgb(22, 22, 22)') {
                black++;
            } else if(window.getComputedStyle(tokens[i]).backgroundColor === 'rgb(175, 175, 175)'){
                white++;
            }
        }
    }
    blackScore.innerHTML = black;
    whiteScore.innerHTML = white;
}

function showWinner(winner) {
    if(winner === 'draw') {
        msg.innerHTML = 'The match is drawn';
    } else if(winner === 'black') {
        msg.innerHTML = 'Player 1 (Black) won the match';
    } else {
        msg.innerHTML = 'Player 2 (White) won the match';
    }
    winCont.style.visibility = 'visible';
    black = white = 0;
}

resetGame.addEventListener('click', () => {
    window.location.href = 'index.html';
});

replay.addEventListener('click', () => {
    winCont.style.visibility = 'hidden';
    window.location.href = 'index.html';
});

buttons.forEach((btn, idx) => {

    btn.addEventListener('click', function() {
        let color = blackTurn ? 'rgb(22, 22, 22)' : 'rgb(175, 175, 175)';
        tokens[idx].style.visibility = 'visible';
        tokens[idx].style.backgroundColor = color;
        btn.disabled = true;
        let dirs = getDirections(idx);
        checkTokens(idx, color, dirs);
        updateScores();
        if(black + white === 100) {
            if(black > white) {
                showWinner('black');
            } else if(black < white) {
                showWinner('white');
            } else {
                showWinner('draw');
            }
        }
        changeFocus(blackTurn ? player2 : player1, blackTurn ? player1 : player2);
    });
});
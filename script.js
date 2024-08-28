function changeFocus(butt1, butt2) {
    butt1.style.backgroundColor = 'rgb(19, 255, 19)';
    butt1.style.boxShadow = '0 0 15px springgreen';

    butt2.style.backgroundColor = 'green';
    butt2.style.boxShadow = 'none';
    
    blackTurn = !blackTurn;
}

function getDirections(source) {
    let row = Math.floor(source/10);          // Row Index
    let col = Math.floor(source%10);           // Column Index
    
    if(row === 0 || row === 1) {                // Row - 0 & 1
        if(col === 0 || col === 1) {                  // Column => 0 & 1
            return [10, 11, 1];                                 // Possible Directions = [Bottom, Bottom-Right, Right]
        } else if(col === 8 || col === 9) {           // Column => 8 & 9
            return [10, 9, -1];                                 // Possible Directions = [Bottom, Bottom-Left, Left]
        } else {                                        // Column => 2nd-7th
            return [1, 11, 10, 9, -1];                          // Possible Directions = [Right, Bottom-Right, Bottom, Bottom-Left, Left]
        }
    } else if(row === 8 || row === 9) {         // Row => 8 & 9
        if(col === 0 || col === 1) {                  // Columm => 0 & 1
            return [-10, -9, 1];                                // Possible Directions = [Top, Top-Right, Right]
        } else if(col === 8 || col === 9) {           // Column => 8 & 9
            return [-10, -11, -1];                              // Possible Directions = [Top, Top-Left, Left]
        } else {                                        // Column => 2nd-7th
            return [-1, -11, -10, -9, 1];                       // Possible Directions = [Left, Top-Left, Top, Top-Right, Right]
        }
    } else {                                        // Row => 2nd-7th
        if(col === 0 || col === 1) {                  // Columm => 0 & 1
            return [-10, -9, 1, 11, 10];                        // Possible Directions = [Top, Top-Right, Right, Bottom-Right, Bottom]
        } else if(col === 8 || col === 9) {           // Column => 8 & 9
            return [10, 9, -1, -11, -10];                       // Possible Directions = [Bottom, Bottom-Left, Left, Top-Left, Top]
        } else {                                        // Column => 2nd-7th
            return [-10, -9, 1, 11, 10, 9, -1, -11];            // Possible Directions = [Top, Top-Right, Right, Bottom-Right, Bottom, Bottom-Left, Left, Top-Left]
        }
    }
}

function checkTokens(source, color, dirs) {
    let inverted = 0;
    dirs.forEach((direction) => {
        let destination = searchToken(source, color, direction);
        if(destination !== -1) { inverted += invertTokens(source, destination, color, direction); }
    });

    black = (blackTurn) ? (black + inverted + 1) : (black - inverted);
    white = (blackTurn) ? (white - inverted) : (white + inverted + 1);

    blackScore.textContent = black;
    whiteScore.textContent = white;
}

function searchToken(source, color, direction) {
    let row, col;
    
    for(let i = source+direction; ; i += direction) {
        if(window.getComputedStyle(tokens[i]).visibility === 'hidden') { return -1; }
        
        let bgColor = window.getComputedStyle(tokens[i]).backgroundColor;
        if(bgColor === color) { return i; }

        row = Math.floor(i/10);
        col = i%10;

        if(row === 0 && direction < -1) { return -1; }
        if(row === 9 && direction > 1) { return -1; }
        if((col === 0) && (direction === -11 || direction === -1 || direction === 9)) { return -1; }
        if((col === 9) && (direction === -9 || direction === 1 || direction === 11)) { return -1; }
    }
}

function invertTokens(source, destination, color, offset) {
    let idx = 0;
    for(let i = source+offset; i !== destination; i += offset, idx++) {
        setTimeout(() => {
            tokens[i].classList.add('flip');
            setTimeout(() => {
                tokens[i].style.backgroundColor = color;
                tokens[i].classList.remove('flip');
            }, 100);
        }, idx * 100);
    }
    return idx;
}

function showWinner(winner) {
    msg.innerHTML = ((winner === 'draw') ? 'The match is drawn' : ((winner === 'black') ? 'Player 1 (Black) won the match' : 'Player 2 (White) won the match'));
    victory.play();
    winCont.style.visibility = 'visible';
    black = 2;
    white = 2;
}

const queryBox = document.querySelector('.ask');

const startGame = document.querySelector('#start');

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

const victory = document.querySelector('#victory');
const tokenPlace = document.querySelector('#placing');

let black = 2, white = 2;


let blackTurn = false;


document.addEventListener('DOMContentLoaded', () => {
    
    changeFocus(blackTurn ? player2 : player1, blackTurn ? player1 : player2);
    blackScore.textContent = black;
    whiteScore.textContent = white;

    
    resetGame.addEventListener('click', () => { window.location.href = 'index.html'; });
    
    replay.addEventListener('click', () => {
        winCont.style.visibility = 'hidden';
        window.location.href = 'index.html';
    });
    
    buttons.forEach((btn, idx) => {
    
        btn.addEventListener('click', function() {
            let color = blackTurn ? 'rgb(25, 25, 25)' : 'rgb(175, 175, 175)';
            tokens[idx].style.visibility = 'visible';
            tokens[idx].style.backgroundColor = color;
            tokenPlace.play();
            btn.disabled = true;
            let dirs = getDirections(idx);
            checkTokens(idx, color, dirs);
            
            if(black + white === 100) { (black > white) ? showWinner('black') : ((black < white) ? showWinner('white') : showWinner('draw')); }
            changeFocus(blackTurn ? player2 : player1, blackTurn ? player1 : player2);
        });
    });
});

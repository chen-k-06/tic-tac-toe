let turnCount = 0;
let AiToggle = document.getElementById("ai-select")
let vsAI = 1; // starts 
const PLAYER_X = 1;
const PLAYER_O = 2;

// let board = {
//     row0box0: "-",
//     row0box1: "-",
//     row0box2: "-",
//     row1box0: "-",
//     row1box1: "-",
//     row1box2: "-",
//     row2box0: "-",
//     row2box1: "-",
//     row2box2: "-",
// }

let board_arr = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]

// event listener for clicks
let boxes = document.querySelectorAll(".box");
check = 0;
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (turnCount === 0) {
            AiToggle.disabled = true;
        }
        row = Math.floor(index / 3);
        column = index % 3;
        console.log("Clicked: ", box);
        if (check == PLAYER_X || check == PLAYER_O) { // game already over 
            return;
        }
        if (box.classList.contains("played")) {
            return;
        }
        if (turnCount % 2 == 0) {
            box.textContent = "X";
            box.classList.add("X");
            // board[`row${row}box${column}`] = "X";
            board_arr[index] = "X";
            console.log(`board_arr[${index}] = "X"`);
        }
        else {
            box.textContent = "O";
            box.classList.add("O");
            // board[`row${row}box${column}`] = "O";
            // console.log(board[`row${row}box${column}`]);
            board_arr[index] = "O";
            console.log(`board_arr[${index}] = "O"`);
        }
        box.classList.add("played");
        turnCount++;
        check = isGameOver(); // returns 0 when game not over, 1 for X win, 2 for O win
        console.log("Check: ", check)
    });
});

function isGameOver() {
    /* Calculates if the tic-tac-toe game is over based on the current board 
    */

    let x_boxes = Array.from(document.querySelectorAll(".X"));
    let o_boxes = Array.from(document.querySelectorAll(".O"));

    if (x_boxes.length < 3 && o_boxes.length < 3) {
        console.log(x_boxes);
        console.log(o_boxes);
        console.log("Not enough moves completed.");
        return 0;
    }

    // all horizontal case 
    for (let i = 0; i < 3; i++) {
        let box0 = document.getElementById(`row-${i}-box-0`);
        let box1 = document.getElementById(`row-${i}-box-1`);
        let box2 = document.getElementById(`row-${i}-box-2`);

        if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
            return PLAYER_X;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return PLAYER_O;
        }
    }

    // all vertical case 
    for (let i = 0; i < 3; i++) {
        let box0 = document.getElementById(`row-0-box-${i}`);
        let box1 = document.getElementById(`row-1-box-${i}`);
        let box2 = document.getElementById(`row-2-box-${i}`);

        if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
            return PLAYER_X;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return PLAYER_O;
        }
    }

    // diagonals 
    let box0 = document.getElementById(`row-0-box-0`);
    let box1 = document.getElementById(`row-1-box-1`);
    let box2 = document.getElementById(`row-2-box-2`);

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return PLAYER_X;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return PLAYER_O;
    }

    box0 = document.getElementById(`row-0-box-2`);
    box1 = document.getElementById(`row-1-box-1`);
    box2 = document.getElementById(`row-2-box-0`);

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return PLAYER_X;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return PLAYER_O;
    }
    return 0;
}

function getAIGuess() {
    // hueristic for 1st guess
    if (turnCount == 0) {
        return [1, 1];
    }
    else {
        let guess = get_best_guess();
    }
    return guess;
}

function get_best_guess() {
    let moves = [];
    let max_player = 0;
    let min_player = 0;
    let best_mini_max = Number.NEGATIVE_INFINITY;
    let best_move = -1;

    // compute players 
    if (turnCount % 2 == 0) {
        max_player = PLAYER_X;
        min_player = PLAYER_O;
    }
    else {
        max_player = PLAYER_O;
        min_player = PLAYER_X;
    }

    // populate moves
    for (let i = 0; i < board_arr.length; i++) {
        if (board_arr[i] === "-") {
            moves.append(i);
        }
    }

    // get minmax value for each move 
    for (let i = 0; i < moves.length; i++) {
        let board_copy = [...board];
        let value = minimax(board_copy, moves[i], max_player, min_player, Number.NEGATIVE_INFINITY, 0);
        if (value > best_mini_max) {
            best_mini_max = value;
            best_move = moves[i];
        }
    }
    return best_move;
}

function minimax(board, index, max_player, min_player, value, more_move_count) {

    return value;
}

AiToggle.addEventListener("input", () => {
    if (AiToggle.value === "1") {
        console.log("Mode: vs Human");
    } else {
        console.log("Mode: vs AI");
    }
});

AiToggle.addEventListener("mousedown", (e) => {
    if (AiToggle.value === "0") {
        AiToggle.value = 1;
        vsAI = 1;
    }
    else {
        AiToggle.value = 0;
        vsAI = 0;
    }
    e.preventDefault();
});

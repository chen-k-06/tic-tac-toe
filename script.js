let turnCount = 0;
let AiToggle = document.getElementById("ai-select")
let vsAI = 1; // starts 
let maximizer;
let minimizer;
let AI_PLAYER;
const PLAYER_X = 1;
const PLAYER_O = 2;
const DRAW = 3;
const WIN_SCORE = 10;
const LOSE_SCORE = -10;

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
        if (check === PLAYER_X || check === PLAYER_O) { // game already over 
            console.log("Game over")
            return;
        }
        if (box.classList.contains("played")) {
            console.log("Box already played")
            return;
        }
        updateBoard(box, index);

        check = isGameOver(board_arr); // returns 0 when game not over, 1 for X win, 2 for O win, 3 for draw
        console.log("Check: ", check)

        if (check === 0 && vsAI === 1) {
            maximizer = (turnCount % 2 === 0) ? PLAYER_X : PLAYER_O;
            minimizer = (turnCount % 2 === 0) ? PLAYER_O : PLAYER_X;
            AI_PLAYER = maximizer;

            let ai_guess_index = get_best_guess();
            let ai_box = document.getElementById(ai_guess_index);
            updateBoard(ai_box, ai_guess_index);
        }
    });
});

function updateBoard(box, index) {
    console.log("TurnCount: ", turnCount);
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
}

function isGameOver(board) {
    /* Calculates if the tic-tac-toe game is over based on the current board 
    */
    let x_boxes = [];
    let o_boxes = [];
    let none_boxes_count = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "X") {
            x_boxes.push(i);
        }
        else if (board[i] === "O") {
            o_boxes.push(i);
        }
        else {
            none_boxes_count++;
        }
    }

    if (x_boxes.length < 3 && o_boxes.length < 3) {
        return 0;
    }

    // all horizontal case 
    for (let i = 0; i < 3; i++) {
        let box0 = i * 3 + 0;
        let box1 = i * 3 + 1;
        let box2 = i * 3 + 2;

        if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
            return PLAYER_X;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return PLAYER_O;
        }
    }

    // all vertical case 
    for (let i = 0; i < 3; i++) {
        let box0 = 0 + i;
        let box1 = 3 + i;
        let box2 = 6 + i;

        if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
            return PLAYER_X;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return PLAYER_O;
        }
    }

    // diagonals 
    let box0 = 0;
    let box1 = 4;
    let box2 = 8;

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return PLAYER_X;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return PLAYER_O;
    }

    box0 = 2;
    box1 = 4;
    box2 = 6;

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return PLAYER_X;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return PLAYER_O;
    }

    if (none_boxes_count === 0) {
        return DRAW;
    }
    return 0;
}

function getAIGuess() {
    // hard code first and second guesses
    if (turnCount == 0) {
        return 4;
    }
    // if (turnCount == 1) {
    //}
    else {
        return get_best_guess();
    }
}

function get_best_guess() {
    let moves = [];
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
            moves.push(i);
        }
    }

    // get minmax value for each move 
    let isMax = true; // you always want to optimize for the player calling the function
    let currentPlayer;
    let best_mini_max = Number.NEGATIVE_INFINITY;
    const turn = turnCount % 2;

    // for each possible move, make that move on a copy of the board
    for (let i = 0; i < moves.length; i++) {
        let board_copy = [...board_arr];

        if (turn === 0) {
            board_copy[moves[i]] = "X";
            currentPlayer = PLAYER_O;
        }
        else {
            board_copy[moves[i]] = "O";
            currentPlayer = PLAYER_X;
        }

        // remove whatever move has been made from the moves array
        let moves_copy = [...moves];

        const index = moves_copy.indexOf(moves[i]);
        if (index > -1) {
            moves_copy.splice(index, 1);
        }
        else {
            console.log("Error: moves[i] not found in moves_copy")
        }

        // find the minimax of this new game
        let value = minimax(board_copy, isMax, 0, moves_copy, currentPlayer);
        console.log("Next move: ", moves[i]);
        console.log("Value: ", value);
        if (value > best_mini_max) {
            best_mini_max = value;
            best_move = moves[i];
        }
    }
    return best_move;
}

function minimax(board, isMax, depth, moves, currentPlayer) {
    // check if game over 
    let game_result = isGameOver(board);
    if (moves.length === 0 || game_result != 0) {
        if (game_result === maximizer) {
            return WIN_SCORE - depth;
        }
        else if (game_result === DRAW) {
            return 0;
        }
        else {
            return LOSE_SCORE + depth;
        }
    }

    // run more minimaxs for all possible moves 
    let best_mini_max = 0
    if (isMax) {
        best_mini_max = Number.NEGATIVE_INFINITY;
    }
    else {
        best_mini_max = Number.POSITIVE_INFINITY;
    }

    for (let i = 0; i < moves.length; i++) {

        // make the move
        let moves_copy = [...moves];
        let board_copy = [...board];
        if (currentPlayer === PLAYER_X) {
            board_copy[moves[i]] = "X";
        }
        else {
            board_copy[moves[i]] = "O";
        }

        // update current player
        if (currentPlayer === PLAYER_X) {
            currentPlayer = PLAYER_O;
        }
        else {
            currentPlayer = PLAYER_X;
        }
        // remove whatever move was made from the moves list 
        moves_copy.splice(i, 1);

        // call minimax for this new game
        if (isMax) {
            let value = minimax(board_copy, false, depth + 1, moves_copy, currentPlayer);
            best_mini_max = Math.max(best_mini_max, value);
        }
        else {
            let value = minimax(board_copy, true, depth + 1, moves_copy, currentPlayer);
            best_mini_max = Math.min(best_mini_max, value);
        }
    }

    return best_mini_max;
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

let turnCount = 0;
let AiToggle = document.getElementById("ai-select")
let vsAI = 1; // starts 
const PLAYER_X = 1;
const PLAYER_O = 2;
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
            return;
        }
        if (box.classList.contains("played")) {
            return;
        }
        updateBoard(box, index);

        check = isGameOver(board_arr); // returns 0 when game not over, 1 for X win, 2 for O win, 3 for draw
        console.log("Check: ", check)

        if (check === 0 && vsAI === 1) {
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
        console.log(x_boxes);
        console.log(o_boxes);
        console.log("Game not over: not enough moves completed.");
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
        return 3;
    }
    return 0;
}

function getAIGuess() {
    // hueristic for 1st guess
    if (turnCount == 0) {
        return 4;
    }
    else {
        return get_best_guess();
    }
}

function get_best_guess() {
    let moves = [];
    let max_player = 0;
    let best_move = -1;

    // compute players 
    if (turnCount % 2 == 0) {
        max_player = PLAYER_O;
    }
    else {
        max_player = PLAYER_X;
    }

    // populate moves
    for (let i = 0; i < board_arr.length; i++) {
        if (board_arr[i] === "-") {
            moves.push(i);
        }
    }

    // get minmax value for each move 
    let isMax = true; // you always want to optimize for the player calling the function
    let best_mini_max = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < moves.length; i++) {
        let board_copy = [...board_arr];
        let moves_copy = [...moves];
        let value = minimax(board_copy, max_player, moves[i], isMax, turnCount, moves_copy, 0);
        if (value > best_mini_max) {
            best_mini_max = value;
            best_move = moves[i];
        }
    }
    return best_move;
}

function minimax(board, index, max_player, isMax, turn_count, moves, moves_made) {
    // make the current move
    const turn = turn_count % 2;
    if (turn === 0) {
        board[index] = "X";
    }
    else {
        board[index] = "O";
    }

    // remove index (move just made) from moves array
    const moves_index = moves.indexOf(index);
    if (moves_index === -1) {
        console.log("Error: index not found in moves array");
    }
    else {
        moves.splice(moves_index, 1);
    }

    // check if game over 
    let game_result = isGameOver(board);
    if (moves.length === 0 || game_result != 0) {
        // needs more implementation, does value change here or later? 
        // probably here
        // every minimax call runs to this base case, 
        // so yeah this is the only one that can do value assignment 
        if (game_result === max_player) {
            return WIN_SCORE - moves_made;
        }
        else if (game_result === 3) {
            return 0;
        }
        else {
            return LOSE_SCORE + moves_made;
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
    turn_count++;

    if (isMax) {
        for (let i = 0; i < moves.length; i++) {
            let moves_copy = [...moves];
            let board_copy = [...board];
            let value = minimax(board_copy, max_player, moves[i], false, turn_count, moves_copy, moves_made + 1);
            best_mini_max = Math.max(best_mini_max, value);
        }
    }
    else {
        for (let i = 0; i < moves.length; i++) {
            let moves_copy = [...moves];
            let board_copy = [...board];
            let value = minimax(board_copy, max_player, moves[i], true, turn_count, moves_copy, moves_made + 1);
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

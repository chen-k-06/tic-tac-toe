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
            console.log("AI guesses box: ", ai_guess_index)
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
    let best_move = -1;
    let currentPlayer = turnCount % 2 == 0 ? PLAYER_X : PLAYER_O;
    let best_mini_max = currentPlayer === maximizer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    // for each possible move, make that move on a copy of the board
    for (let i = 0; i < 9; i++) {
        if (board_arr[i] === "-") {
            let board_copy = [...board_arr]; // clone every iteration
            let currentPlayerCopy = currentPlayer;

            console.log("NEW FIRST LEVEL BOARD \n")
            console.log("board_copy for move ", i, " ", board_copy);

            board_copy = make_move(board_copy, i, currentPlayerCopy);
            currentPlayerCopy = switch_current_player(currentPlayerCopy);
            let value = minimax(board_copy, 0, currentPlayerCopy);
            console.log("Value: ", value);

            if (currentPlayerCopy === maximizer) {
                best_mini_max = Math.max(best_mini_max, value);
            }
            else {
                best_mini_max = Math.min(best_mini_max, value);
            }

            board_copy = undo_move(board_copy, i);
        }
    }
    return best_move;
}

function minimax(board, depth, currentPlayer) {
    // check if game over 
    let game_result = isGameOver(board);
    if (game_result != 0) {
        if (game_result === AI_PLAYER) {
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
    let best_mini_max = currentPlayer === maximizer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "-") {
            let board_copy = [...board]; // clone every iteration
            let currentPlayerCopy = currentPlayer;

            // make the move
            board_copy = make_move(board_copy, i, currentPlayerCopy);

            // update current player
            currentPlayerCopy = switch_current_player(currentPlayerCopy);

            // console.log("board_copy for move ", i, " ", board);

            // call minimax for this new game
            if (currentPlayerCopy === maximizer) {
                let value = minimax(board_copy, depth + 1, currentPlayerCopy);
                best_mini_max = Math.max(best_mini_max, value);
            }
            else {
                let value = minimax(board_copy, depth + 1, currentPlayerCopy);
                best_mini_max = Math.min(best_mini_max, value);
            }

            board_copy = undo_move(board_copy, i);
        }
    }
    return best_mini_max;
}

function make_move(board, index, player) {
    if (player === PLAYER_X) {
        board[index] = "X";
    }
    else {
        board[index] = "O";
    }
    return board;
}

function undo_move(board, index) {
    board[index] = "-";
    return board;
}

function switch_current_player(currentPlayer) {
    return currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
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

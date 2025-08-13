let turnCount = 0;
let AiToggle = document.getElementById("ai-select");
let vsAI = 1; // starts 
let maximizer;
let minimizer;
let AI_PLAYER = null;
let boxes = document.querySelectorAll(".box");
let check = 0;
const PLAYER_X = 1;
const PLAYER_O = 2;
const DRAW = 3;
const WIN_SCORE = 10;
const LOSE_SCORE = -10;
let board_arr = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

/**
 * Handles a click on a game board box.
 * 
 * Adds an X or O to the clicked box. If an AI player is active, 
 * also makes the AI move in response. Ends the game if a win or draw occurs.
 *
 * @param {MouseEvent} event - The click event object triggered when a box is clicked.
 * @returns {void}
 */
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
        if (check != 0) {
            endGame(check);
        }

        console.log("Check: ", check)

        if (check === 0 && vsAI) {
            maximizer = (turnCount % 2 === 0) ? PLAYER_X : PLAYER_O;
            minimizer = (turnCount % 2 === 0) ? PLAYER_O : PLAYER_X;
            AI_PLAYER = maximizer;

            let ai_guess_index = get_best_guess();
            console.log("AI guesses box: ", ai_guess_index)
            let ai_box = document.getElementById(ai_guess_index);
            updateBoard(ai_box, ai_guess_index);
            check = isGameOver(board_arr);
            if (check != 0) {
                endGame(check);
            }
        }
    });
});

/**
 * Toggles the AI mode when the AI toggle element is clicked.
 *
 * Switches `vsAI` between 0 (vs Human) and 1 (vs AI) when the toggle is pressed.
 * Updates the toggle value, logs the mode, and prevents default behavior.
 *
 * @param {MouseEvent} e - The mouse event triggered by clicking the toggle.
 * @returns {void}
 */
AiToggle.addEventListener("mousedown", (e) => {
    vsAI = vsAI ? 0 : 1; // toggle
    AiToggle.value = vsAI;
    console.log(`Mode: ${vsAI ? "vs AI" : "vs Human"}`);
    e.preventDefault();
});

/**
 * Updates `vsAI` mode when the toggle input value changes.
 *
 * Parses the toggle value as an integer and logs the selected mode.
 *
 * @returns {void}
 */
AiToggle.addEventListener("input", () => {
    vsAI = parseInt(AiToggle.value);
    console.log(`Mode: ${vsAI ? "vs AI" : "vs Human"}`);
});

/**
 * Updates a game board box with the current player's mark.
 *
 * Modifies the text content and CSS classes of the specified box to 
 * reflect the current player's move (X or O). Also updates the board array 
 * and increments the turn counter.
 *
 * @param {HTMLDivElement} box - The box element on the board to update.
 * @param {number} index - The index of the given box in the board array.
 * @returns {void}
 */
function updateBoard(box, index) {
    console.log("TurnCount: ", turnCount);
    if (turnCount % 2 == 0) {
        box.textContent = "X";
        box.classList.add("X");
        board_arr[index] = "X";
        console.log(`board_arr[${index}] = "X"`);
    }
    else {
        box.textContent = "O";
        box.classList.add("O");
        board_arr[index] = "O";
        console.log(`board_arr[${index}] = "O"`);
    }
    box.classList.add("played");
    turnCount++;
}

/**
 * Places the specified player's mark on the given board at the given index.
 *
 * Modifies the board array in place by setting the element at the specified
 * index to either "X" or "O" depending on the player constant provided.
 *
 * @param {string[]} board - The current board state as an array of 9 strings:
 *                           "X", "O", or "-" for empty.
 * @param {number} index - The position (0–8) where the mark should be placed.
 * @param {number} player - The player constant (PLAYER_X or PLAYER_O).
 * @returns {string[]} The updated board array after the move.
 */
function make_move(board, index, player) {
    if (player === PLAYER_X) {
        board[index] = "X";
    }
    else {
        board[index] = "O";
    }
    return board;
}

/**
 * Switches the current player.
 *
 * Returns the opposing player constant based on the current player:
 * - If current player is PLAYER_X, returns PLAYER_O.
 * - If current player is PLAYER_O, returns PLAYER_X.
 *
 * @param {number} currentPlayer - The current player constant (PLAYER_X or PLAYER_O).
 * @returns {number} The opposing player constant.
 */
function switch_current_player(currentPlayer) {
    return currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
}

/**
 * Determines the AI player's next move.
 *
 * On the first turn (turnCount === 0), the AI always chooses the center
 * square (index 4). On subsequent turns, it calls `get_best_guess()` to 
 * determine the optimal move.
 *
 * @returns {number} The index (0–8) of the board position the AI will play.
 */
function getAIGuess() {
    // hard code first and second guesses
    if (turnCount == 0) {
        return 4;
    }
    else {
        return get_best_guess();
    }
}

/**
 * Calculates the optimal move for the current player using the minimax algorithm.
 *
 * Iterates over all available moves on the current board, simulates each move,
 * and evaluates it using `minimax()` to choose the best possible outcome for the
 * current player. The "best" move is determined by whether the current player
 * is the maximizer or minimizer in the minimax search.
 *
 * @returns {number} The index (0–8) of the optimal move for the current player.
 */
function get_best_guess() {
    let best_move = -1;
    let currentPlayer = turnCount % 2 == 0 ? PLAYER_X : PLAYER_O;
    let best_mini_max = currentPlayer === maximizer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    // for each possible move, make that move on a copy of the board
    for (let i = 0; i < 9; i++) {
        if (board_arr[i] === "-") {
            let board_copy = [...board_arr];
            let currentPlayerCopy = currentPlayer;

            board_copy = make_move(board_copy, i, currentPlayerCopy);
            currentPlayerCopy = switch_current_player(currentPlayerCopy);
            let value = minimax(board_copy, 0, currentPlayerCopy);

            if (currentPlayer === maximizer) {
                if (best_mini_max < value) {
                    best_move = i;
                    best_mini_max = value;
                }
            }
            else {
                if (best_mini_max > value) {
                    best_move = i;
                    best_mini_max = value;
                }
            }
        }
    }
    return best_move;
}

/**
 * Recursively evaluates the game tree to determine the best achievable score 
 * for the current player using the minimax algorithm.
 *
 * The function simulates all possible future moves until the game ends 
 * (win, loss, or draw) and assigns scores based on the outcome:
 * - WIN_SCORE - depth: Win for the maximizer (penalizes longer paths to victory).
 * - 0: Draw.
 * - LOSE_SCORE + depth: Loss for the maximizer (penalizes earlier losses).
 *
 * @param {string[]} board - The current board state as an array of 9 strings:
 *                           "X", "O", or "-" for empty.
 * @param {number} depth - The current depth in the game tree (used to weight scores).
 * @param {number} currentPlayer - The current player constant (PLAYER_X or PLAYER_O).
 * @returns {number} The best score achievable from the given state for the current player.
 */
function minimax(board, depth, currentPlayer) {
    // check if game over 
    let game_result = isGameOver(board);
    if (game_result != 0) {
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
    let best_mini_max = currentPlayer === maximizer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "-") {
            let board_copy = [...board]; // clone every iteration
            let currentPlayerCopy = currentPlayer;

            // make the move
            board_copy = make_move(board_copy, i, currentPlayerCopy);

            // update current player
            currentPlayerCopy = switch_current_player(currentPlayerCopy);

            // call minimax for this new game
            if (currentPlayer === maximizer) {
                let value = minimax(board_copy, depth + 1, currentPlayerCopy);
                best_mini_max = Math.max(best_mini_max, value);
            }
            else {
                let value = minimax(board_copy, depth + 1, currentPlayerCopy);
                best_mini_max = Math.min(best_mini_max, value);
            }
        }
    }
    return best_mini_max;
}


/**
 * Determines if the tic-tac-toe game has ended.
 *
 * Checks the current board state for a win (horizontal, vertical, or diagonal)
 * or a draw. Returns a constant indicating the result:
 * - 0: Game not over
 * - PLAYER_X: X wins
 * - PLAYER_O: O wins
 * - DRAW: Game is a draw
 *
 * @param {string[]} board - The current state of the board as an array of 9 strings:
 *                           "X", "O", or "-" for empty.
 * @returns {number} The game status code (0, PLAYER_X, PLAYER_O, or DRAW).
 */
function isGameOver(board) {
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

/**
 * Displays the endgame popup with a message indicating the winner or draw.
 *
 * Updates the `endgame-message` element text based on the game result and 
 * removes the "hidden" class from the `endgame-popup` to make it visible.
 *
 * @param {number} gameResult - The result code:
 *                              - PLAYER_X: X player wins
 *                              - PLAYER_O: O player wins
 *                              - DRAW: Game ends in a draw
 * @returns {void}
 */
function endGame(gameResult) {
    const popup = document.getElementById("endgame-popup");
    const message = document.getElementById("endgame-message");

    if (AI_PLAYER != null && gameResult === AI_PLAYER) {
        console.log("Game over. The winner was the AI player.");
        message.textContent = "Game over. The winner was the AI player.";
    }
    else if (gameResult === DRAW) {
        console.log("Game over. The game ended in a draw.");
        message.textContent = "Game over. The game ended in a draw.";
    }
    else if (gameResult === PLAYER_X) {
        console.log("Game over. The winner was the X player.");
        message.textContent = "Game over. The winner was the X player.";
    }
    else {
        console.log("Game over. The winner was the O player.");
        message.textContent = "Game over. The winner was the O player.";
    }

    popup.classList.remove("hidden");
}
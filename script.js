turnCount = 0;

// event listener for clicks
let boxes = document.querySelectorAll(".box");
check = False;
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (check == 0) { // game already over 
            return;
        }
        if (box.classList.contains("played")) {
            return;
        }
        input = 0 // 0 for O or 1 for X
        if (turnCount % 2 == 0) {
            box.textContent = "X";
            box.classList.add("X");
            input = "1"
        }
        else {
            box.textContent = "O";
            box.classList.add("O");
            input = "0";
        }
        box.classList.add("played")
        turnCount++;
        check = isGameOver([box, input]);
    });
});

// function for if game is over
function isGameOver(last_move) {
    /* Calculates if the tic-tac-toe game is over based on the current board and last move
    *
    * @param 
    * 
    */
    let x_boxes = document.querySelectorAll(".X");
    let o_boxes = document.querySelectorAll(".O");
    if (x_boxes.length < 3 && o_boxes.length < 3) {
        return false;
    }

}

// function for get AI guess
function getAIGuess() {
    // API call
    return 0;
}
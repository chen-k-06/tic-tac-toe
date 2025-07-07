turnCount = 0;

// event listener for clicks
let boxes = document.querySelectorAll(".box");
check = false;
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
        check = isGameOver();
    });
});

function isGameOver() {
    /* Calculates if the tic-tac-toe game is over based on the current board 
    */
    let x_boxes = document.querySelectorAll(".X");
    let o_boxes = document.querySelectorAll(".O");
    if (x_boxes.length < 3 && o_boxes.length < 3) {
        return false;
    }

    // all horizontal case 
    for (let i = 0; i < 3; i++) {
        let box0 = document.getElementById(`row-${i}-box-0`);
        let box1 = document.getElementById(`row-${i}-box-1`);
        let box2 = document.getElementById(`row-${i}-box-2`);

        if (box0 in x_boxes && box1 in x_boxes && box2 in x_boxes) {
            return true
        }
        if (box0 in o_boxes && box1 in o_boxes && box2 in o_boxes) {
            return true
        }
    }

    // all vertical case 
    for (let i = 0; i < 3; i++) {
        let box0 = document.getElementById(`row-0-box-${i}`);
        let box1 = document.getElementById(`row-1-box-${i}`);
        let box2 = document.getElementById(`row-2-box-${i}`);

        if (box0 in x_boxes && box1 in x_boxes && box2 in x_boxes) {
            return true
        }
        if (box0 in o_boxes && box1 in o_boxes && box2 in o_boxes) {
            return true
        }
    }

    // diagonals 
    let box0 = document.getElementById(`row-0-box-0`);
    let box1 = document.getElementById(`row-1-box-1`);
    let box2 = document.getElementById(`row-2-box-2`);

    if (box0 in x_boxes && box1 in x_boxes && box2 in x_boxes) {
        return true
    }
    if (box0 in o_boxes && box1 in o_boxes && box2 in o_boxes) {
        return true
    }

    box0 = document.getElementById(`row-0-box-2`);
    box1 = document.getElementById(`row-1-box-1`);
    box2 = document.getElementById(`row-2-box-0`);

    if (box0 in x_boxes && box1 in x_boxes && box2 in x_boxes) {
        return true
    }
    if (box0 in o_boxes && box1 in o_boxes && box2 in o_boxes) {
        return true
    }

    return false
}

// function for get AI guess
function getAIGuess() {
    // API call
    return 0;
}
turnCount = 0;
let board = {
    row0box0: "0",
    row0box1: "0",
    row0box2: "0",
    row1box0: "0",
    row1box1: "0",
    row1box2: "0",
    row2box0: "0",
    row2box1: "0",
    row2box2: "0",
}

// event listener for clicks
let boxes = document.querySelectorAll(".box");
check = 0;
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        row = Math.floor(index / 3);
        column = index % 3;
        console.log("Clicked: ", box);
        if (check == 1 || check == 2) { // game already over 
            return;
        }
        if (box.classList.contains("played")) {
            return;
        }
        if (turnCount % 2 == 0) {
            box.textContent = "X";
            box.classList.add("X");
            board[`row${row}box${column}`] = "X";
            console.log(board[`row${row}box${column}`]);
        }
        else {
            box.textContent = "O";
            box.classList.add("O");
            board[`row${row}box${column}`] = "O";
            console.log(board[`row${row}box${column}`]);
        }
        box.classList.add("played");
        turnCount++;
        check = isGameOver(); // returns 0 when game not over, 1 for X win, 2 for O win
        console.log("Check: ", check)
    });
});

// event listener for hint button
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
            return 1;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return 2;
        }
    }

    // all vertical case 
    for (let i = 0; i < 3; i++) {
        let box0 = document.getElementById(`row-0-box-${i}`);
        let box1 = document.getElementById(`row-1-box-${i}`);
        let box2 = document.getElementById(`row-2-box-${i}`);

        if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
            return 1;
        }
        if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
            return 2;
        }
    }

    // diagonals 
    let box0 = document.getElementById(`row-0-box-0`);
    let box1 = document.getElementById(`row-1-box-1`);
    let box2 = document.getElementById(`row-2-box-2`);

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return 1;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return 2;
    }

    box0 = document.getElementById(`row-0-box-2`);
    box1 = document.getElementById(`row-1-box-1`);
    box2 = document.getElementById(`row-2-box-0`);

    if (x_boxes.includes(box0) && x_boxes.includes(box1) && x_boxes.includes(box2)) {
        return 1;
    }
    if (o_boxes.includes(box0) && o_boxes.includes(box1) && o_boxes.includes(box2)) {
        return 2;
    }
    return 0;
}

function getAIGuess(board, turn_cout) {
    // API call
    return 0;
}
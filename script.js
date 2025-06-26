turnCount = 0;

// event listener for clicks
let boxes = document.querySelectorAll(".box");
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (box.classList.contains("played")) {
            return;
        }
        if (turnCount % 2 == 0) {
            box.textContent = "X";
        }
        else {
            box.textContent = "O";
        }
        box.classList.add("played")
        turnCount++;
    });
});

// function for if game is over

// function for get AI guess
// -> make this work for one player first
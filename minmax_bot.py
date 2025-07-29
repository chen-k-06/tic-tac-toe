# let board = {
#     row0box0: "0",
#     row0box1: "0",
#     row0box2: "0",
#     row1box0: "0",
#     row1box1: "0",
#     row1box2: "0",
#     row2box0: "0",
#     row2box1: "0",
#     row2box2: "0",
# }

def get_AI_guess(board, move_count):
    # hueristic guess if move count is 1
    if move_count == 1:
        get_first_guess(board)        

def get_first_guess(board): #translate to JS, don't call API in this case
    row = -1
    column = -1

    for key, value in board: 
        if value == "X":
            row = key[3]
            column = key[7]
    
    if row == 1 and column == 1: 
        return [0,0]
    
    else: 
        return [1,1]
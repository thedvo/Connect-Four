/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x]) */
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++){
    board[y] = [];
    for (let x = 0; x < WIDTH; x++){
      board[y][x] = null;
    };
  };
}

/** makeHtmlBoard: make HTML table and row of column tops. */
 makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board');
 
  // Creates top row of the board. Calls handleClick function when a cell is clicked
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  
  //Creates the cells for the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Creates main board. For Loops create rows using HEIGHT & WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // dynamically sets the id for each cell 
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

// // SHOWS WHICH PLAYER'S TURN
// const gameWindow = document.querySelector('#game');
// const playerTurn = document.createElement('p');
// gameWindow.append(playerTurn);
// // created a paragraph element to be used to show which player is currently playing. Refer below to switch player function

/** findSpotForCol: given column x, return top empty y (null if filled) */
  // TODO: write the real version of this, rather than always returning 0
findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
        return y;
    };
  };
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
placeInTable = (y, x) => {
    // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */
  // TODO: pop up alert message

endGame = (msg) => {
  // Allows final piece to be played on screen before message pops up
  setTimeout(() => alert(msg), 500);

  // Prevents adding pieces after game is over
  const top = document.getElementById('column-top');
  top.removeEventListener('click', handleClick);
}

/** handleClick: handle click of column top to play piece */

handleClick = (e) => {
  // get x from ID of clicked cell
  let x = +e.target.id;
  // ASK ABOUT THIS


  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer; // matches the cell to the player
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    endGame(`Player ${currPlayer} wins!`);
  }

  // check for tie
  // if no more cells remain null, endGame
  if (board[0].every((val) => val !== null)) {
    endgame("It's a draw!")
  }

  // switches players
 currPlayer = currPlayer === 1 ?  2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //calculates possible win scenarios (connect 4 horizonally, vertically, diagonally right/left)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if either of these scenarios return true, return true.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();


// RESTART BUTTON
const restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', restartGame);

function restartGame() {
  location.reload();
}

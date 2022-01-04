/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
// const width = 7;
// const height = 6;

// let currPlayer = 1; // active player: 1 or 2
// const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x]) */
  // TODO: set "board" to empty height x width matrix array
class Game {
  constructor (p1, p2) {
    this.players = [p1, p2];
    this.height = 6;
    this.width = 7;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height ; y++){
      this.board[y] = [];
      for (let x = 0; x < this.width; x++){
        this.board[y][x] = null;
      };
    };
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.querySelector('#board');
    board.innerHTML = ''; 
    // Prevents window from making extra boards on screen when player resets board
  
    // Creates top row of the board. Calls handleClick function when a cell is clicked
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // bind handleClick to the Game class. Set it to this.handleClick variable. 
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);
    
    //Creates the cells for the top row
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // Creates main board. For Loops create rows using height & width
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        // dynamically sets the id for each cell 
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
    // this function tries to find an empty spot in the selected column to put a piece
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
          return y;
      };
    };
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
      // Creates a div element for the pieces to be placed
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
    // pops up alert message when there is a winner or tie
  endGame(msg) {
    // Timer allows final piece to be played on screen before message pops up
    setTimeout(() => alert(msg), 500);

    // Prevents adding pieces after game is over. 
    const top = document.getElementById('column-top');
    top.removeEventListener('click', this.handleGameClick);
    document.getElementById('start-button').innerText = "Play Again";
    // Since game is over, innerText of the "Start" button is changed to "Play Again".
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(e) {
    // get x from ID of clicked cell
    const x = +e.target.id;
    // ASK ABOUT THIS

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer; // matches the cell to the player
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      if(this.currPlayer === this.players[0]) {
        this.endGame(`Player 1 is the winner! 🥳☝🏼`);
      }
      else {
        this.endGame(`Player 2 is the winner! 🥳✌🏼`);
      }
    }

    // check for tie
    // if no more cells remain null on the top row (index 0), endGame
    if (this.board[0].every(cell => cell !== null)) {
      this.endGame("It's a draw! 🤯");
    }

    // switches players
  this.currPlayer = 
  this.currPlayer === this.players[0] ?  this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = (cells) => 
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    //calculates possible win scenarios (connect 4 horizonally, vertically, diagonally right/left)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // if either of these scenarios are true, return true to alert winner.
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor (color){
    this.color = color;
  }
}


// Initial page before game begins. Once "Start" is clicked, game class is created with p1, p2"
document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('start-button').innerText = "Start";
  // Resets innerText of button to "Start" if it is currently "Play Again".
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});
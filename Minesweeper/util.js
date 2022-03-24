function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
function renderBoard(board) {
  var strHTML = "";
  // console.table(board);
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];

      switch (gLevel.SIZE) {
        case 4:
          strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell"></td>`;

          break;
        case 8:
          strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell-medium"></td>`;

          break;
        case 12:
          strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this,event,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell-hard"></td>`;

          break;
      }
    }
    strHTML += "</tr>";
    var elBoard = document.querySelector(".board-container");
    elBoard.innerHTML = strHTML;
  }
}
function changeboardSize(size) {
  gLevel.SIZE = size;
  switch (gLevel.SIZE) {
    case 4:
      gLevel.lifes = 1;
      gLevel.mines = 2;
      gLevel.cells = 16;
      break;
    case 8:
      gLevel.lifes = 2;
      gLevel.mines = 12;
      gLevel.cells = 64;

      break;
    case 12:
      gLevel.lifes = 3;
      gLevel.mines = 30;
      gLevel.cells = 144;

      break;
  }

  initGame();
}
function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isBombed: false,
        isMarked: false,
      };
    }
  }
  return board;
}
function showNegs(cellI, cellJ, board) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > board[i].length - 1) continue;
      if (i === cellI && j === cellJ) continue;
      var elCurrCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      cellClicked(elCurrCell, i, j);
    }
  }
}
function setMinesNegsCount(cellI, cellJ, board) {
  var MinesNegsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > board[i].length - 1) continue;
      if (i === cellI && j === cellJ) continue;

      if (board[i][j].isMine) MinesNegsCount++;
    }
  }
  return MinesNegsCount;
}

function revealAllBombs(mat) {
  for (var i = 0; i < mat.length; i++) {
    for (var j = 0; j < mat[0].length; j++) {
      var elCell = mat[i][j];
      if (elCell.isMine) renderCell(i, j, mine);
    }
  }
}
function renderCell(i, j, value) {
  var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
  elCell.innerHTML = value;
}

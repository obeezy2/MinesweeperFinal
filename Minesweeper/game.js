const smile = "😀";
const won = "😎";
const lost = "😖";
const flag = "🚩";
const mine = "💣";
const life = "🖤";
const EMPTY = "";

var gElModal = document.querySelector(".modal");
var gTable = document.querySelector(".border-container");
var gGameInterval;
var gBoard;

var gLevel = {
  SIZE: 4,
  mines: 2,
  lifes: 1,
  cells: 16,
};
var gGame = {
  isOn: false,
  isOver: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame() {
  gElModal.querySelector(" button").innerText = smile;
  gBoard = createBoard(gLevel.SIZE);
  createRandomMines();
  renderBoard(gBoard);
  gGame = {
    isOn: false,
    isOver: false,
    shownCount: 0,
    secsPassed: 0,
  };
  clearInterval(gGameInterval);
  gElModal.querySelector(" h1 span").innerText = 0;
  playBoom = false;
  playedBoom = false;

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

  renderLifes(gLevel.lifes);
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOver) {
    if (!gGame.isOn) {
      gGame.isOn = true;
      gGameInterval = setInterval(() => {
        gGame.secsPassed++;
        gElModal.querySelector(".game h1 span").innerText = gGame.secsPassed;
        console.log(gGame.secsPassed);
      }, 1000);
    }

    if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
      if (gBoard[i][j].isMine) {
        gLevel.lifes--;
        gBoard[i][j].isBombed = true;
        renderLifes(gLevel.lifes);
        elCell.innerText = mine;
        gBoard[i][j].isShown = true;
        if (!gLevel.lifes) {
          gElModal.querySelector("button").innerText = lost;
          gameOver();
        }
      } else {
        gGame.shownCount++;
        var mineNegs = setMinesNegsCount(i, j, gBoard);
        elCell.style.backgroundColor = "#FFFACD";

        gBoard[i][j].isShown = true;
        if (mineNegs) {
          elCell.innerText = mineNegs;
        } else {
          elCell.innerText = "";
          showNegs(i, j, gBoard);
        }
      }
    }
    checkVictory(gBoard);
  }
}
function createRandomMines() {
  for (var i = 0; i < gLevel.mines; i++) {
    var currI = getRandomInt(0, gLevel.SIZE);
    var currj = getRandomInt(0, gLevel.SIZE);
    if (gBoard[currI][currj].isMine) i--;
    gBoard[currI][currj].isMine = true;
  }
}

function renderLifes(lifes) {
  var elLife = gElModal.querySelector("p");
  switch (lifes) {
    case 1:
      elLife.innerText = life;
      break;
    case 2:
      elLife.innerText = `${life}  ${life}`;
      break;
    case 3:
      elLife.innerText = `${life} ${life} ${life}`;
      break;
    default:
      elLife.innerText = "";
      break;
  }
}

function gameOver() {
  revealAllBombs(gBoard);
  gGame.isOver = true;
  clearInterval(gGameInterval);

  gGame.isOn = false;
}

function cellMarked(elCell, ev, i, j) {
  if (!gGame.isOver) {
    if (ev.which === 3 && !gBoard[i][j].isShown) {
      elCell.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
      });
      if (!gGame.isOn) {
        gGame.isOn = true;
        gGameInterval = setInterval(() => {
          gGame.secsPassed++;
          gElModal.querySelector(".game h1 span").innerText = gGame.secsPassed;
        }, 1000);
      }
      if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        elCell.innerText = flag;
      } else {
        gBoard[i][j].isMarked = false;
        elCell.innerText = "";
      }
    }
    checkVictory(gBoard);
  }
}

function checkVictory(board) {
  var markedCount = 0;
  var notMineCount = 0;
  var shownCount = 0;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (!board[i][j].isMine) notMineCount++;
      if (board[i][j].isMarked || board[i][j].isBombed) markedCount++;
      if (board[i][j].isShown) shownCount++;
    }
  }
  if (
    shownCount === notMineCount &&
    shownCount + markedCount === gLevel.cells
  ) {
    gElModal.querySelector(" button").innerText = won;
    gameOver();
  }
}

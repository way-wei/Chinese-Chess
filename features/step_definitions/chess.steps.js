const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const { ChessService } = require('../../src/ChessService');

let chessService;
let moveResult;

Before(function() {
  chessService = undefined;
  moveResult = undefined;
});

Given(/^the board is empty except for a (.+) at \((\d+), (\d+)\)$/, function (piece, row, col) {
  chessService = new ChessService();
  chessService.setPiece(piece, Number(row), Number(col));
});

Given(/^the board has:$/, function (dataTable) {
  chessService = new ChessService();
  dataTable.hashes().forEach(({ Piece, Position }) => {
    const match = Position.match(/\((\d+), (\d+)\)/);
    if (match) {
      chessService.setPiece(Piece, Number(match[1]), Number(match[2]));
    }
  });
});

When(/^Red moves the (.+) from \((\d+), (\d+)\) to \((\d+), (\d+)\)$/, function (piece, fromRow, fromCol, toRow, toCol) {
  piece = 'Red ' + piece;
  console.log('When step:', piece, fromRow, fromCol, toRow, toCol);
  moveResult = chessService.move(piece, [Number(fromRow), Number(fromCol)], [Number(toRow), Number(toCol)]);
  console.log('moveResult:', moveResult);
});

Then('the move is legal', function () {
  assert.strictEqual(moveResult.legal, true);
});

Then('the move is illegal', function () {
  assert.strictEqual(moveResult.legal, false);
});

Then('Red wins immediately', function () {
  assert.strictEqual(moveResult.redWins, true);
});

Then('the game is not over just from that capture', function () {
  assert.strictEqual(moveResult.redWins, false);
}); 
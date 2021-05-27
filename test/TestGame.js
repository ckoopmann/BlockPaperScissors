var BlockPaperScissors = artifacts.require("BlockPaperScissors");

function calculateResult(firstMove, secondMove) {
  if (firstMove == secondMove) {
    return 3;
  } else if (
    (firstMove == 1 && secondMove == 3) ||
    (firstMove == 2 && secondMove == 1) ||
    (firstMove == 3 && secondMove == 2)
  ) {
    return 1;
  } else {
    return 2;
  }
}

contract("TestGame", (accounts) => {
  const owner = accounts[0];
  const opponent = accounts[1];

  describe("BlockPaperScissors", function () {
    let gameId;
    let secret = web3.utils.soliditySha3("123456");
    before(async function () {
      this.contract = await BlockPaperScissors.new({
        from: owner,
      });
    });

    let moves = [1, 2, 3];
    for (var i = 0; i < moves.length; i++) {
      for (var j = 0; j < moves.length; j++) {
        let firstPlayerMove = moves[i];
        let secondPlayerMove = moves[j];
        let expectedResult = calculateResult(firstPlayerMove, secondPlayerMove);

        it(`${firstPlayerMove} / ${secondPlayerMove} - should be able to start a new Game`, async function () {
          const hashedMove = await this.contract.encryptMove.call(
            firstPlayerMove,
            secret
          );
          gameId = await this.contract.startGame.call(opponent, hashedMove);
          await this.contract.startGame(opponent, hashedMove);
        });

        it(`${firstPlayerMove} / ${secondPlayerMove} - Opponent should be able to make move`, async function () {
          console.log("Second Player Move: ", secondPlayerMove);
          await this.contract.makeMove(gameId, secondPlayerMove, {
            from: opponent,
          });
        });

        it(`${firstPlayerMove} / ${secondPlayerMove} - First Player should be able to reveal`, async function () {
          // Paper move
          await this.contract.evaluateGame(gameId, secret, { from: owner });
        });

        it(`${firstPlayerMove} / ${secondPlayerMove} - Correct Result is returned for evaluated game`, async function () {
          const gameResult = await this.contract.getGameResult.call(gameId);
          assert.equal(gameResult, expectedResult, "Wrong game result");
        });
      }
    }
  });
});

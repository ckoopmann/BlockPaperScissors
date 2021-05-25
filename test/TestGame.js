var BlockPaperScissors = artifacts.require("BlockPaperScissors");

contract("TestGame", (accounts) => {
  const owner = accounts[0];
  const opponent = accounts[1];
  const moves = [1, 2, 3];
  const moveLabels = { 1: "Block", 2: "Paper", 3: "Scissors" };

  describe("BlockPaperScissors", function () {
    let gameId;
    let secret = web3.utils.soliditySha3("123456");
    before(async function () {
      this.contract = await BlockPaperScissors.new({
        from: owner,
      });
    });

    for (firstPlayerMove of moves) {
      for (secondPlayerMove of moves) {
        it(`should be able to start a new Game with ${moveLabels[firstPlayerMove]}`, async function () {
          const hashedMove = await this.contract.encryptMove.call(
            firstPlayerMove,
            secret
          );
          console.log("encrypted move: ", hashedMove);
          gameId = await this.contract.startGame.call(opponent, hashedMove);
          await this.contract.startGame(opponent, hashedMove);
        });

        it(`Opponent should be able to make move ${moveLabels[secondPlayerMove]}`, async function () {
          await this.contract.makeMove(gameId, secondPlayerMove, {
            from: opponent,
          });
        });

        it(`First Player should be able to reveal ${moveLabels[firstPlayerMove]} move`, async function () {
          // Paper move
          await this.contract.evaluateGame(gameId, secret, { from: owner });
        });

        it(`Correct Result is returned for evaluated game with moves ${moveLabels[firstPlayerMove]} and ${moveLabels[secondPlayerMove]}`, async function () {
          const gameResult = await this.contract.getGameResult.call(gameId);
          assert.equal(gameResult, 2, "Wrong game result");
        });
      }
    }
  });
});

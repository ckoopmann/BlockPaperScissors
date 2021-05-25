var BlockPaperScissors = artifacts.require("BlockPaperScissors");

contract("TestGame", (accounts) => {
  const owner = accounts[0];
  const opponent = accounts[1];

  describe("BlockPaperScissors", function () {
    let gameId;
    let secret;
    before(async function () {
      this.contract = await BlockPaperScissors.new({
        from: owner,
      });
    });

    it("should be able to start a new Game", async function () {
      secret = web3.utils.soliditySha3('123456');
      // Hash rock move
      const hashedMove = await this.contract.encryptMove.call(1, secret);
      console.log("encrypted move: ", hashedMove);
      gameId = await this.contract.startGame.call(opponent, hashedMove);
      await this.contract.startGame(opponent, hashedMove);
    });

    it("Opponent should be able to make move", async function () {
      // Paper move
      const move = 2;
      await this.contract.makeMove(gameId, move, {from: opponent});
    });

    it("First Player should be able to reveal move", async function () {
      // Paper move
      await this.contract.revealMove(gameId, secret, {from: owner});
    });
  });
});

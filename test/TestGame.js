var BlockPaperScissors = artifacts.require("BlockPaperScissors");

contract("TestGame", (accounts) => {
  const owner = accounts[0];

  describe("BlockPaperScissors", function () {
    beforeEach(async function () {
      this.contract = await BlockPaperScissors.new({
        from: owner,
      });
    });

    it("should be able to start a new Game", async function () {
      const opponent = accounts[1];
      console.log(web3.version);
      console.log(web3.utils.soliditySha3);
      const secret = web3.utils.soliditySha3('123456');
      // Hash rock move
      const hashedMove = web3.utils.soliditySha3(1, secret);
      await this.contract.startGame(opponent, hashedMove);
    });
  });
});

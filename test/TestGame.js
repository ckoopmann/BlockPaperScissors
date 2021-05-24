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
      await this.contract.startGame(opponent);
    });

  });
});


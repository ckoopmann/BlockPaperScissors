const BlockPaperScissors = artifacts.require("BlockPaperScissors");

module.exports = function(deployer) {
  deployer.deploy(BlockPaperScissors);
};

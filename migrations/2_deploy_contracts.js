const SimpleStorage = artifacts.require("SimpleStorage");
const TutorialToken = artifacts.require("TutorialToken");
const BlockPaperScissors = artifacts.require("BlockPaperScissors");
const ComplexStorage = artifacts.require("ComplexStorage");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(BlockPaperScissors);
  deployer.deploy(ComplexStorage);
};

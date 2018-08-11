var Matching = artifacts.require("./Matching.sol");
var MatchCoin = artifacts.require("./MatchCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Matching);
  deployer.deploy(MatchCoin);
};

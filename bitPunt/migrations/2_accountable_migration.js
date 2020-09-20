const Accountable = artifacts.require("Accountable");

module.exports = function(deployer) {
  deployer.deploy(Accountable);
};

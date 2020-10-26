const Callable = artifacts.require("Callable");

module.exports = function(deployer) {
    deployer.deploy(Callable);
};

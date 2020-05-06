var Public = artifacts.require("Public");

const name = "EthiquePublic";
const symbol = "EQP";
let initialSupply = 1000000

module.exports = function(deployer) {
  deployer.deploy(Public, name, symbol, initialSupply);
};

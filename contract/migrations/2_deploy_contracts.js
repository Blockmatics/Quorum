var Public = artifacts.require("Public");

const name = "EthiquePublic";
const symbol = "EQP";

module.exports = function(deployer) {
  deployer.deploy(Public, name, symbol);
};

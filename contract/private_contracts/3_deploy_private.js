var Public = artifacts.require("Public");
var East = artifacts.require("East");

const name = "EthiqueEast";
const symbol = "EQE";

module.exports = function(deployer) {
  deployer.deploy(East, name, symbol);
};

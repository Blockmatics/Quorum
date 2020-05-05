var East = artifacts.require("East");

const name = "EthiqueEast";
const symbol = "EQE";
let initialSupply = 1000000

module.exports = function(deployer) {
  deployer.deploy(East, name, symbol, initialSupply);
};

var West = artifacts.require("West");

const name = "EthiqueWest";
const symbol = "EQW";
let initialSupply = 1000000

module.exports = function(deployer) {
  // deployer.deploy(East, name, symbol, initialSupply)
  deployer.deploy(West, name, symbol, initialSupply,
    {
      privateFor: ['QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=']
    }
  );
};

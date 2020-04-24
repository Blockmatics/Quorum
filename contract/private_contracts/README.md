# Deploying Private Contract Lesson

1. Copy 3_deploy_private.js to migrations/ directory
2. Add the privateFor flag:
    ```
    module.exports = function(deployer) {
      deployer.deploy(East, name, symbol, {
        privateFor: ['publicKeyOfNode'],
      });
    };
    ```
3. Retrieve the Transaction Manager's public key from the node config files:  
   `run-nodes/config/keys/tm1.pub`
4. Add node2 to truffle-config.js

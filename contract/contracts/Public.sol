pragma solidity ^0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Public is ERC20 {
  uint public INITIAL_SUPPLY = 1000000;

  constructor(string memory _name, string memory _symbol)
    ERC20(_name, _symbol) public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }
}

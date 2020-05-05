pragma solidity ^0.6.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract East is ERC20 {
  constructor(string memory _name, string memory _symbol, uint _initialSupply)
    ERC20(_name, _symbol) public {
    _mint(msg.sender, _initialSupply);
  }
}

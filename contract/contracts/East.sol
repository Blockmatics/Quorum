pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract East is ERC20, ERC20Detailed {
  uint public INITIAL_SUPPLY = 1000000;

  constructor(string memory _name, string memory _symbol)
    ERC20Detailed(_name, _symbol, 0) public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }
}

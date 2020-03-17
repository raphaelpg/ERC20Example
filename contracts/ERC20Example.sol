pragma solidity 0.5.12;

import "./ERC20.sol";
import "./Ownable.sol";

contract ERC20Example is ERC20, Ownable {
    string public name;
    string public symbol;
    uint256 public decimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        _mint(msg.sender, totalSupply);
    }
}
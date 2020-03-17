const ERC20Example = artifacts.require("ERC20Example");
const _name = "MyTokenExample";
const _symbol = "MTE";
const _decimals = 18;
const _totalSupply = 1000000;

module.exports = function(deployer) {
  deployer.deploy(ERC20Example, _name, _symbol, _decimals, _totalSupply);
};

# ERC20 Example Token

This is an ERC20 Token template to deploy on the blockchain.  

One token example has been deployed on Ropsten testnet at '0x6f1d6BD8C4cca3464aB0DE2FD2BFE532a2B60eC3' called 'EET'.  

With Truffle I ran tests to check all 'ERC20' standards functions and also 'Ownable' functions.


### Tip for deployment with Remix

I've used truffle-flatener to concatenate all the contracts into one and ease Remix deployment.  

```
npm install truffle-flattener -g
truffle-flattener <solidity-files>
```
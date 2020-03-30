# ERC20 Example Token

This is an ERC20 Token template to deploy on the blockchain.  

One token example has been deployed on Ropsten testnet at '0x6f1d6BD8C4cca3464aB0DE2FD2BFE532a2B60eC3' called 'EET'.  

With Truffle, tested ERC20 metadatas, standards and internal functions, also 'Ownable' functions.


### Tip for deployment with Remix

I've used truffle-flatener to concatenate all the contracts into one and ease Remix deployment.  

```
npm install truffle-flattener -g
truffle-flattener <solidity-files>
```

ERC20 EIP https://eips.ethereum.org/EIPS/eip-20
# ERC20 Example Token

This is an ERC20 Token template to deploy on the blockchain.  

One token example has been deployed on Ropsten testnet at '0xBE1A43023f0A1ff3A00995A48Cc85B1E2D9861f5' called 'EET'.  

With Truffle I ran tests to check all ERC20 standards functions and also "Ownable"


If you want to deploy your version you can do it using Metamask and Remix.  

# Tip for deployment with Remix

I've used truffle-flatener to concatenate all the contracts into one and ease Remix deployment.  

```
npm install truffle-flattener -g
truffle-flattener <solidity-files>
```
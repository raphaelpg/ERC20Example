const { BN, ether, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const ERC20Example = artifacts.require("ERC20Example");

contract("ERC20Example", function(accounts){
    const owner = accounts[0];
    const spender = accounts[1];
    const address0 = '0x0000000000000000000000000000000000000000';
    const _name = "MyTokenExample";
    const _symbol = "MTE";
    const _decimals = 18;
    const _totalSupply = 1000000;

    //Before each unit test  
    beforeEach(async function() {
        this.ERC20ExampleInstance = await ERC20Example.new(_name, _symbol, _decimals, _totalSupply);
    });


    //Testing ERC20 metadata
    //Test 1
    it("Check token name", async function() {
        console.log("Testing ERC20 metadata:");
        expect(await this.ERC20ExampleInstance.name.call()).to.equal("MyTokenExample");
    });

    //Test 2
    it("Check token symbol", async function() {
        expect(await this.ERC20ExampleInstance.symbol.call()).to.equal("MTE");
    });

    //Test 3
    it("Check token decimals", async function() {
        expect(await this.ERC20ExampleInstance.decimals.call()).to.be.bignumber.equal(new BN(18));
    });


    //Testing ERC20 basic functions
    //Test 4
    it('Check totalSupply() function', async function () {
        console.log("Testing ERC20 basic functions:");
        let totalSupply = await this.ERC20ExampleInstance.totalSupply();
        expect(totalSupply).to.be.bignumber.equal(new BN(1000000));
    });

    //Test 5
    it("Check balanceOf() function", async function () {
        let balanceOf = await this.ERC20ExampleInstance.balanceOf(owner);
        expect(balanceOf).to.be.bignumber.equal(new BN(1000000));
    });

    //Test 6
    it("Check transfer() function", async function () {
        let ownerBalanceBefore = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceBefore = await this.ERC20ExampleInstance.balanceOf(spender);
        let amount = new BN('10');

        await this.ERC20ExampleInstance.transfer(spender, amount, {from: owner});

        let ownerBalanceAfter = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceAfter = await this.ERC20ExampleInstance.balanceOf(spender);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(spenderBalanceAfter).to.be.bignumber.equal(spenderBalanceBefore.add(amount));

        //`recipient` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.transfer(address0, amount, {from: owner}),"ERC20: transfer to the zero address");        
        //the caller must have a balance of at least `amount`
        await expectRevert(this.ERC20ExampleInstance.transfer(owner, new BN('11'), {from: spender}),"ERC20: transfer amount exceeds balance");        
    });

    //Test 7
    it("Check approve() and allowance() functions", async function () {
        let amount = new BN('10');
        await this.ERC20ExampleInstance.approve(spender, amount, {from: owner});
        let amountApproved = await this.ERC20ExampleInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(amount);

        //`spender` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.approve(address0, amount, {from: owner}),"ERC20: approve to the zero address");        
    });

    //Test 8
    it("Check transferFrom() function", async function () {
        let ownerBalanceBefore = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceBefore = await this.ERC20ExampleInstance.balanceOf(spender);
        let amount = new BN('10');

        await this.ERC20ExampleInstance.approve(spender, amount, {from: owner});

        await this.ERC20ExampleInstance.transferFrom(owner, spender, amount, {from: spender});

        let ownerBalanceAfter = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceAfter = await this.ERC20ExampleInstance.balanceOf(spender);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(spenderBalanceAfter).to.be.bignumber.equal(spenderBalanceBefore.add(amount));

        //Testing reverts
        //`sender` and `recipient` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.transferFrom(owner, address0, amount, {from: spender}),"Insufficient allowance");
        await expectRevert(this.ERC20ExampleInstance.transferFrom(address0, spender, amount, {from: spender}),"Insufficient allowance");

        //`sender` must have a balance of at least `amount`.
        await this.ERC20ExampleInstance.approve(owner, new BN(20), {from: spender});
        await expectRevert(this.ERC20ExampleInstance.transferFrom(spender, owner, new BN(20), {from: owner}),"ERC20: transfer amount exceeds balance");

        //the caller must have allowance for `sender`'s tokens of at least `amount`.
        await expectRevert(this.ERC20ExampleInstance.transferFrom(owner, spender, new BN(11), {from: spender}),"Insufficient allowance");
    });

    //Test 9
    it("Check increaseAllowance() function", async function () {
        let initialAmount = new BN('10');
        let addedAmount = new BN('5');
        await this.ERC20ExampleInstance.approve(spender, initialAmount, {from: owner});
        await this.ERC20ExampleInstance.increaseAllowance(spender, addedAmount, {from: owner});
        let amountApproved = await this.ERC20ExampleInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(initialAmount.add(addedAmount));

        //`spender` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.increaseAllowance(address0, addedAmount, {from: owner}),"ERC20: approve to the zero address");
    });

    //Test 10
    it("Check decreaseAllowance() function", async function () {
        let initialAmount = new BN('10');
        let subtractedAmount = new BN('5');
        await this.ERC20ExampleInstance.approve(spender, initialAmount, {from: owner});
        await this.ERC20ExampleInstance.decreaseAllowance(spender, subtractedAmount, {from: owner});
        let amountApproved = await this.ERC20ExampleInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(initialAmount.sub(subtractedAmount));

        //Testing reverts
        //`spender` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.decreaseAllowance(address0, subtractedAmount, {from: owner}),"ERC20: decreased allowance below zero");  

        //`spender` must have allowance for the caller of at least `subtractedValue`.
        let subtractedAmount2 = new BN('50');
        await expectRevert(this.ERC20ExampleInstance.decreaseAllowance(spender, subtractedAmount2, {from: owner}),"ERC20: decreased allowance below zero");
    });


    //Testing ERC20 internal fonctions
    //Test 11
    it("Check _transfer() function", async function () {
        console.log("Testing ERC20 internal functions:");
        let ownerBalanceBefore = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceBefore = await this.ERC20ExampleInstance.balanceOf(spender);
        let amount = new BN('10');

        await this.ERC20ExampleInstance.internalTransfer(owner, spender, amount, {from: owner});

        let ownerBalanceAfter = await this.ERC20ExampleInstance.balanceOf(owner);
        let spenderBalanceAfter = await this.ERC20ExampleInstance.balanceOf(spender);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(spenderBalanceAfter).to.be.bignumber.equal(spenderBalanceBefore.add(amount));

        //`sender` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalTransfer(address0, spender, amount),"ERC20: transfer from the zero address")

        //`recipient` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalTransfer(owner, address0, amount, {from:owner}),"ERC20: transfer to the zero address")
        
        //`sender` must have a balance of at least `amount`.
        await expectRevert(this.ERC20ExampleInstance.internalTransfer(owner, spender, new BN('1000001'), {from:owner}),"ERC20: transfer amount exceeds balance")
    });

    //Test 12
    it("Check _mint() function", async function () {
        let spenderBalanceBefore = await this.ERC20ExampleInstance.balanceOf(spender);
        let amount = new BN('10');
        let totalSupplyBefore = await this.ERC20ExampleInstance.totalSupply();

        await this.ERC20ExampleInstance.internalMint(spender, amount);

        let spenderBalanceAfter = await this.ERC20ExampleInstance.balanceOf(spender);
        let totalSupplyAfter = await this.ERC20ExampleInstance.totalSupply();

        expect(spenderBalanceAfter).to.be.bignumber.equal(spenderBalanceBefore.add(amount));
        expect(totalSupplyAfter).to.be.bignumber.equal(totalSupplyBefore.add(amount));

        //`recipient` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalMint(address0, amount),"ERC20: mint to the zero address")
    });

    //Test 13
    it("Check _burn() function", async function () {
        let ownerBalanceBefore = await this.ERC20ExampleInstance.balanceOf(owner);
        let amount = new BN('10');
        let totalSupplyBefore = await this.ERC20ExampleInstance.totalSupply();

        await this.ERC20ExampleInstance.internalBurn(owner, amount);

        let ownerBalanceAfter = await this.ERC20ExampleInstance.balanceOf(owner);
        let totalSupplyAfter = await this.ERC20ExampleInstance.totalSupply();

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(totalSupplyAfter).to.be.bignumber.equal(totalSupplyBefore.sub(amount));

        //`account` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalBurn(address0, amount),"ERC20: burn from the zero address");

        //`account` must have at least `amount` tokens.
        await expectRevert(this.ERC20ExampleInstance.internalBurn(owner, new BN('1000000')),"ERC20: burn amount exceeds balance");
    });

    //Test 14
    it("Check _approve() function", async function () {
        let amount = new BN('10');
        await this.ERC20ExampleInstance.internalApprove(owner, spender, amount, {from: owner});
        let amountApproved = await this.ERC20ExampleInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(amount);

        //`owner` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalApprove(address0, spender, amount),"ERC20: approve from the zero address");

        //`spender` cannot be the zero address.
        await expectRevert(this.ERC20ExampleInstance.internalApprove(owner, address0, amount, {from: owner}),"ERC20: approve to the zero address");        
    });

    //Test 15
    it("Check _burnFrom() function", async function () {
        let ownerBalanceBefore = await this.ERC20ExampleInstance.balanceOf(owner);
        let amount = new BN('10');
        let totalSupplyBefore = await this.ERC20ExampleInstance.totalSupply();

        await this.ERC20ExampleInstance.approve(spender, amount, {from:owner});
        let spenderAllowanceBefore = await this.ERC20ExampleInstance.allowance(owner, spender);

        await this.ERC20ExampleInstance.internalBurnFrom(owner, amount, {from:spender});

        let ownerBalanceAfter = await this.ERC20ExampleInstance.balanceOf(owner);
        let totalSupplyAfter = await this.ERC20ExampleInstance.totalSupply();
        let spenderAllowanceAfter = await this.ERC20ExampleInstance.allowance(owner, spender);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(totalSupplyAfter).to.be.bignumber.equal(totalSupplyBefore.sub(amount));
        expect(spenderAllowanceAfter).to.be.bignumber.equal(spenderAllowanceBefore.sub(amount));

        //`account` must have at least `amount` tokens.
        await expectRevert(this.ERC20ExampleInstance.internalBurnFrom(owner, new BN('1000000')),"ERC20: burn amount exceeds balance");
    });

    //Testing Ownable fonctions
    //Test 16
    it('Check owner() function', async function () {
        console.log("Testing Ownable fonctions:");
        let currentOwner = await this.ERC20ExampleInstance.owner();
        expect(currentOwner).to.be.equal(owner);
    });

    //Test 17
    it('Check isOwner() function', async function () {
        let isOwner = await this.ERC20ExampleInstance.isOwner({from: owner});
        expect(isOwner).to.be.equal(true);
    });

    //Test 18
    it('Check renounceOwnership() function', async function () {
        await this.ERC20ExampleInstance.renounceOwnership({from: owner});
        let isOwner = await this.ERC20ExampleInstance.isOwner({from: owner});
        expect(isOwner).to.be.equal(false);
    })

    //Test 19
    it('Check transferOwnership() function', async function () {
        await this.ERC20ExampleInstance.transferOwnership(spender, {from: owner});
        let isOwner = await this.ERC20ExampleInstance.isOwner({from: spender});
        expect(isOwner).to.be.equal(true);
    })

    //Test 20
    it('Check onlyOwner() modifier', async function () {
        await expectRevert(this.ERC20ExampleInstance.transferOwnership(spender, {from: spender}),"Ownable: caller is not the owner");
    })    
});
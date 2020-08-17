const FlipOut = artifacts.require("FlipOut");
const truffleAssert = require("truffle-assertions");

contract ("FlipOut", async function(accounts){
    let instance;
    let owner;
    let user;

    const finney_0 = await web3.utils.toWei("0", "finney");
    const finney_1 = await web3.utils.toWei("1","finney");
    const finney_10 = await web3.utils.toWei("10", "finney");
    const finney_11 = await web3.utils.toWei("11", "finney");
    const finney_19 = await web3.utils.toWei("19", "finney");
    const finney_20 = await web3.utils.toWei("20", "finney");
    const finney_50 = await web3.utils.toWei("50","finney");
    const finney_100 = await web3.utils.toWei("100","finney");
    const finney_500 = await web3.utils.toWei("500","finney");
    const ether_1 = await web3.utils.toWei("1", "ether");

    beforeEach(async function(){
        instance = await FlipOut.new();
        owner = accounts[0];
        user = accounts[1];
    });


    it("Balance should be 0 at start of test and should be increased after owner deposit", async function(){
        assert(contractBalance = await web3.eth.getBalance(instance.address), "Not right");
        let origContractBalance = 0;
        await instance.depositToContract({value: finney_100});
        assert(contractBalance > 0, "Contract balance has not been increased");
        assert(contractBalance == finney_100, "Not 100 finney");
    });


    it("Should allow owner to deposit at least 20 finney into the contract and for the contract balance to match the blockchain balance", async function(){
        await instance.depositToContract({value: finney_20, from: owner});
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(contractBalance == finney_20, "Balance is not 20 finney");
        await truffleAssert.passes(await instance.depositToContract({value: finney_50, from: owner}), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(await instance.depositToContract({value: ether_1, from: owner}), truffleAssert.ErrorType.REVERT);
    });


    it("Shouldn't allow owner to deposit less than 20 finney into the contract", async function(){
        await truffleAssert.fails(await instance.depositToContract({value: finney_19, from: owner}), truffleAssert.ErrorType.REVERT);
    });


    it("Shouldn't allow anyone other than the owner to deposit funds to the contract", async function(){
        await truffleAssert.fails(await instance.depositToContract({value: finney_50, from: user}), truffleAssert.ErrorType.REVERT);
    });


    it("Should allow owner to withdraw funds from contract and for contract to reset to 0 (which will match blockchain balance)", async function(){
        await instance.depositToContract({value: finney_100, from: owner});
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(contractBalance == finney_100, "Balance is not 100 finney");
        await instance.withdrawContractBalance({from: owner});
        assert(contractBalance == 0, "Contract Balance has not reset to 0");
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
    });


    it("Should allow age to be entered by multiple people and return their age and legal age status", async function( ){
        await instance.enterYourAge(40);
        let personsAge = await instance.getAge();
        assert(personsAge.age == 40, "The age is incorrect");
        assert(personsAge.legalAge == true, "Has not tracked legal age status correctly");
        await instance.enterYourAge(16, {from: user});
        let secondPersonsAge = await instance.getAge({from: user});
        assert(secondPersonsAge.age == 16, "The age of the second person is incorrect");
        assert(secondPersonsAge.legalAge == false, "The legal age status of the second person has not tracked correctly");
    });



})

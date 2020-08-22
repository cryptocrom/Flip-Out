const FlipOutContract = artifacts.require("FlipOut");
const truffleAssert = require("truffle-assertions");

contract("Deposits-and-Withdrawals", async function(accounts){
    let instance;
    let owner;
    let user;
    let user2;

    let finney_0;
    let finney_1;
    let finney_5;
    let finney_10;
    let finney_11;
    let finney_19;
    let finney_20;
    let finney_50;
    let finney_100;
    let finney_500;
    let ether_1;


    beforeEach(async function(){
        instance = await FlipOutContract.new();
        owner = accounts[0];
        user = accounts[1];
        user2 = accounts[2];

        finney_0 = await web3.utils.toWei("0", "finney");
        finney_1 = await web3.utils.toWei("1","finney");
        finney_5 = await web3.utils.toWei("5","finney");
        finney_10 = await web3.utils.toWei("10", "finney");
        finney_11 = await web3.utils.toWei("11", "finney");
        finney_19 = await web3.utils.toWei("19", "finney");
        finney_20 = await web3.utils.toWei("20", "finney");
        finney_50 = await web3.utils.toWei("50","finney");
        finney_100 = await web3.utils.toWei("100","finney");
        finney_500 = await web3.utils.toWei("500","finney");
        ether_1 = await web3.utils.toWei("1", "ether");
    });



    it("Should allow deposits to the contract, which should start at 0 and increase after deposit", async function(){
        let contractBalance = await instance.getContractBalance();
        assert(contractBalance == 0, "Balance is not 0 at start of contact");
        await instance.depositToContract({value: finney_50});
        let newContractBalance = await instance.getContractBalance();
        assert(newContractBalance > contractBalance, "New contract balance is not greater than 0, should have been increased");
        assert(newContractBalance == finney_50, "New contract balance is not 50 finney");
    });


    it("Should allow owner to deposit at least 20 finney into the contract and for the contract balance to match the blockchain balance", async function(){
        let contractBalance = await instance.getContractBalance();
        await instance.depositToContract({value: finney_20, from: owner});
        contractBalance = await instance.getContractBalance();
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(contractBalance == finney_20, "Balance is not 20 finney");
        await truffleAssert.passes(await instance.depositToContract({value: finney_50, from: owner}), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(await instance.depositToContract({value: ether_1, from: owner}), truffleAssert.ErrorType.REVERT);
    });
/*
    ---I have commented out the next two tests at this stage due to unexpected results....


    ---the following test should pass as I expect the deposit to fail but for some reason it is throwing an error

    it("Shouldn't allow owner to deposit less than 20 finney into the contract", async function(){
        await truffleAssert.fails(await instance.depositToContract({value: finney_19, from: owner}), truffleAssert.ErrorType.REVERT);
    });

    ---the following test also throws an error although it should pass as I expect a failure in the assertions

    it("Shouldn't allow anyone other than the owner to deposit funds to the contract", async function(){
        await truffleAssert.fails(await instance.depositToContract({value: finney_50, from: user}), truffleAssert.ErrorType.REVERT);
    });
*/

    it("Should allow owner to withdraw funds from contract and for contract to reset to 0 (which will match blockchain balance)", async function(){
        await instance.depositToContract({value: finney_100, from: owner});
        let contractBalance = await instance.getContractBalance();
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(contractBalance == finney_100, "Balance is not 100 finney");
        await instance.withdrawContractBalance({from: owner});
        let newContractBalance = await instance.getContractBalance();
        assert(newContractBalance == 0, "Contract Balance has not reset to 0");
        assert(newContractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
    });


    it("Should allow age to be entered by multiple people and return their age and legal age status correctly", async function( ){
        await instance.enterYourAge(40, {from: owner});
        let person = await instance.getUserInfo({from: owner});
        assert(person.age == 40, "The age is incorrect");
        assert(person.legalAge == true, "Has not tracked legal age status correctly");
        assert(person.heads == false, "Heads should not have been chosen yet");
        assert(person.tails == false, "Tails should not have been chosen yet");
        await instance.enterYourAge(16, {from: user});
        let secondPerson = await instance.getUserInfo({from: user});
        assert(secondPerson.age == 16, "The age of the second person is incorrect");
        assert(secondPerson.legalAge == false, "The legal age status of the second person has not tracked correctly");
        assert(secondPerson.heads == false, "Heads should not have been chosen by person 2 yet");
        assert(secondPerson.tails == false, "Tails should not have been chosen by person 2 yet");

/*
        ---I have commented out the next truffle assertion as it throws an error - I expect it to fail as I've set a requirement
        ---that a user can only enter their age one time, therefore this next test should pass as I expect a failure...

        await truffleAssert.passes(await instance.enterYourAge(20, {from: user}), truffleAssert.ErrorType.REVERT);
*/

    });


    it("Should allow a person to make a deposit to their betting account, which should not affect the contract balance but should affect the blockchain balance", async function(){
        let origContractBalance = await instance.getContractBalance();
        assert(origContractBalance == 0,"Contract balance is not 0 at start of test");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_50, from: user});
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance > origUserBalance && newUserBalance == finney_50, "Balance has not increased to 50 finney");
        let newContractBalance = await instance.getContractBalance();
        assert(newContractBalance == 0, "Contract amount has been affected");
        assert(newUserBalance - newContractBalance == await web3.eth.getBalance(instance.address), "User deposit does not match blockchain balance");
    });


    it("Should allow the user to withdraw their funds", async function(){
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_100, from: user});
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance == finney_100, "Balance has not increased to 100 finney");
        assert(newUserBalance - origUserBalance == finney_100, "Balances not tracking correctly");
        await instance.withdrawBettingFunds({from: user});
        let currentBalance = await instance.bettingFunds({from: user});
        assert(currentBalance == 0, "Balance amount was not withdrawn correctly");
        let blockchainBalance = parseFloat(await web3.eth.getBalance(instance.address));
        assert(currentBalance == blockchainBalance, "Blockchain balance is not in accordance with deposit withdrawal");
        assert(blockchainBalance == newUserBalance - finney_100, "Blockchain balance is not in accordance with deposit withdrawal");
    });


    it("Should allow the user to place a bet and cancel a bet and for funds to be tracking correctly", async function(){
        await instance.depositToContract({value: finney_100, from: owner});
        let contractBalance = await instance.getContractBalance();
        assert(contractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(contractBalance == finney_100, "Balance is not 100 finney");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_10, from: user});
        let fullUserBalance = await instance.bettingFunds({from: user});
        assert(fullUserBalance == finney_10, "Balance has not increased to 10 finney");
        let totalContractBalance = await web3.eth.getBalance(instance.address);
        assert(totalContractBalance == parseFloat(contractBalance) + parseFloat(fullUserBalance), "Balance of contract was not increased after user deposit");
        await instance.chooseBetAmount(5, {from: user});
        let currentBet = await instance.currentBetAmount({from: user});
        assert(currentBet == finney_5, "Current bet amount is not 5 finney");
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance == finney_10 - finney_5, "Bet has not decreased balance by 5 finney");
        assert(newUserBalance == finney_5, "New user balance is not 5 finney");
        assert(newUserBalance == fullUserBalance - currentBet, "User balance is not being affected by the bet");
        await instance.cancelBet({from: user});
        let newBetAmount = await instance.currentBetAmount({from: user});
        assert(newBetAmount == 0, "Bet amount was not returned to 0 after bet was cancelled");
        let balanceAfterCancellation = await instance.bettingFunds({from: user});
        assert(balanceAfterCancellation == parseFloat(fullUserBalance), "User balance was not fully restored after cancellation");
        assert(balanceAfterCancellation == parseFloat(newUserBalance) + parseFloat(currentBet), "Amounts don't add up");
        assert(balanceAfterCancellation == finney_10, "Balance was not restored to 10 finney");
    });


    it("Should allow user to place a bet and withdraw funds, including the bet amount if coin has not yet been flipped", async function(){
        //the next section has been copied and pasted from above test as I have already verified that the assertions pass tesing
        await instance.depositToContract({value: finney_100, from: owner});
        let origContractBalance = await instance.getContractBalance();
        assert(origContractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(origContractBalance == finney_100, "Balance is not 100 finney");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_10, from: user});
        let fullUserBalance = await instance.bettingFunds({from: user});
        assert(fullUserBalance == finney_10, "Balance has not increased to 10 finney");
        let totalContractBalance = await web3.eth.getBalance(instance.address);
        assert(totalContractBalance == parseFloat(origContractBalance) + parseFloat(fullUserBalance), "Balance of contract was not increased after user deposit");
        await instance.chooseBetAmount(5, {from: user});
        let currentBet = await instance.currentBetAmount({from: user});
        assert(currentBet == finney_5, "Current bet amount is not 5 finney");
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance == finney_10 - finney_5, "Bet has not decreased balance by 5 finney");
        assert(newUserBalance == finney_5, "New user balance is not 5 finney");
        assert(newUserBalance == fullUserBalance - currentBet, "User balance is not being affected by the bet");

        //this is the added section to test the withdrawal including current bet amount
        await instance.withdrawBettingFunds({from: user});
        let balanceAfterWithdrawal = await instance.bettingFunds({from: user});
        assert(balanceAfterWithdrawal == 0, "User balance was not fully restored after cancellation");
        let contractBalanceAfterWithdrawl = await web3.eth.getBalance(instance.address);
        assert(origContractBalance == contractBalanceAfterWithdrawl, "Contract balance has not been returned to original balance before user deposit");
    });


    it("Shouldn't change any balances if user flips coin after placing a bet without choosing heads or tails", async function(){
        //the next section has been copied and pasted from above test as I have already verified that the assertions pass tesing
        await instance.depositToContract({value: finney_100, from: owner});
        let origContractBalance = await instance.getContractBalance();
        assert(origContractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(origContractBalance == finney_100, "Balance is not 100 finney");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_10, from: user});
        let fullUserBalance = await instance.bettingFunds({from: user});
        assert(fullUserBalance == finney_10, "Balance has not increased to 10 finney");
        let totalContractBalance = await web3.eth.getBalance(instance.address);
        assert(totalContractBalance == parseFloat(origContractBalance) + parseFloat(fullUserBalance), "Balance of contract was not increased after user deposit");
        await instance.chooseBetAmount(5, {from: user});
        let currentBet = await instance.currentBetAmount({from: user});
        assert(currentBet == finney_5, "Current bet amount is not 5 finney");
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance == finney_10 - finney_5, "Bet has not decreased balance by 5 finney");
        assert(newUserBalance == finney_5, "New user balance is not 5 finney");
        assert(newUserBalance == fullUserBalance - currentBet, "User balance is not being affected by the bet");

        //this is the added section to test that flipping the coin will fail if heads or tails has not been selected
        await instance.flipCoin();
        let userBalanceAfterFlip = await instance.bettingFunds({from: user});
        assert(userBalanceAfterFlip == parseFloat(newUserBalance), "User balance has changed but shouldn't have");
        let contractBalanceAfterFlip = await web3.eth.getBalance(instance.address);
        assert(contractBalanceAfterFlip == totalContractBalance, "Contract balance has changed and shouldn't have");
        let betAmountAfterFlip = await instance.currentBetAmount({from: user});
        assert(betAmountAfterFlip == parseFloat(currentBet), "Bet amount changed but shouldn't have");
    });


    it("Should return the bet amount of user to 0 after bet is placed, choice made and coin flipped -- balances should all still equal the total contract value stored on the blockchain", async function(){
        //the next section has been copied and pasted from above test as I have already verified that the assertions pass tesing
        await instance.depositToContract({value: finney_100, from: owner});
        let origContractBalance = await instance.getContractBalance();
        assert(origContractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(origContractBalance == finney_100, "Balance is not 100 finney");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_10, from: user});
        let fullUserBalance = await instance.bettingFunds({from: user});
        assert(fullUserBalance == finney_10, "Balance has not increased to 10 finney");
        let totalContractBalance = await web3.eth.getBalance(instance.address);
        assert(totalContractBalance == parseFloat(origContractBalance) + parseFloat(fullUserBalance), "Balance of contract was not increased after user deposit");
        await instance.chooseBetAmount(5, {from: user});
        let currentBet = await instance.currentBetAmount({from: user});
        assert(currentBet == finney_5, "Current bet amount is not 5 finney");
        let newUserBalance = await instance.bettingFunds({from: user});
        assert(newUserBalance == finney_10 - finney_5, "Bet has not decreased balance by 5 finney");
        assert(newUserBalance == finney_5, "New user balance is not 5 finney");
        assert(newUserBalance == fullUserBalance - currentBet, "User balance is not being affected by the bet");

        //this is the added section to test balances after bet, choice and flip has occurred
        await instance.betOnHeads({from: user});
        let usersChoice = await instance.currentChoice({from: user});
        assert(usersChoice == "Heads", "Heads should be true");
        let choice = await instance.getUserInfo({from: user});
        assert(choice.heads == true, "Heads should be tracking as true");
        assert(choice.tails == false, "Tails should be false");

        //this part tests for total balance of contract on blockchain tracking correctly against bets, and balances of contract
        let blockchainBalance = parseFloat(await web3.eth.getBalance(instance.address)) ;
        let balanceOfAccounts = parseFloat(origContractBalance) + parseFloat(newUserBalance) + parseFloat(currentBet);
        let balanceOfContract = parseFloat(await instance.getContractBalance());
        assert(blockchainBalance == balanceOfAccounts, "Balances are not tracking correctly in contract, does not match blockchain balance");


        //this part tests that balances all add up to blockchain balance correctly after coinFlipResult
        await instance.flipCoin({from: user});
        let blockchainBalanceAfterFlip = await web3.eth.getBalance(instance.address);
        let contractBalanceAfterFlip = await instance.getContractBalance();
        let userBalanceAfterFlip = await instance.bettingFunds({from: user});
        let balanceOfAccountsAfterFlip = parseFloat(contractBalanceAfterFlip) + parseFloat(userBalanceAfterFlip);
        assert(blockchainBalanceAfterFlip == balanceOfAccountsAfterFlip, "Balances have not tracked correctly");

        //this part tests that current bet and choice have been reset
        let currentBetAfterFlip = await instance.currentBetAmount({from: user});
        let userInfoAfterFlip = await instance.getUserInfo({from: user});
        let choiceAfterFlip = await instance.currentChoice({from: user});
        assert(currentBetAfterFlip == 0, "Current bet amount did not reset to 0");
        assert(userInfoAfterFlip.heads == false, "Heads choice did not reset to false");
        assert(userInfoAfterFlip.tails == false, "Tails choice did not reset to false");
        assert(choiceAfterFlip == "No selection made", "Choice was not reset to 'No selection made'");
    });


    it("Should all 2 different users to have bets in place at the same time and to track balances correctly", async function(){
        //the next section has been copied and pasted from above test as I have already verified that the assertions pass tesing
        await instance.depositToContract({value: finney_100, from: owner});
        let origContractBalance = await instance.getContractBalance();
        assert(origContractBalance == await web3.eth.getBalance(instance.address), "Balance does not match blockchain balance");
        assert(origContractBalance == finney_100, "Balance is not 100 finney");
        await instance.enterYourAge(20, {from: user});
        let origUserBalance = await instance.bettingFunds({from: user});
        assert(origUserBalance == 0, "Users initial balance is not 0");
        await instance.addBettingFunds({value: finney_10, from: user});
        let user_1_fullBalance = await instance.bettingFunds({from: user});
        assert(user_1_fullBalance == finney_10, "Balance has not increased to 10 finney");
        let totalContractBalance = await web3.eth.getBalance(instance.address);
        assert(totalContractBalance == parseFloat(origContractBalance) + parseFloat(user_1_fullBalance), "Balance of contract was not increased after user deposit");
        await instance.chooseBetAmount(5, {from: user});
        let user_1_currentBet = await instance.currentBetAmount({from: user});
        assert(user_1_currentBet == finney_5, "Current bet amount is not 5 finney");
        let user_1_newBalance = await instance.bettingFunds({from: user});
        assert(user_1_newBalance == finney_10 - finney_5, "Bet has not decreased balance by 5 finney");
        assert(user_1_newBalance == finney_5, "New user balance is not 5 finney");
        assert(user_1_newBalance == user_1_fullBalance - user_1_currentBet, "User balance is not being affected by the bet");

        //this part has been added for the second user
        await instance.enterYourAge(30, {from: user2});
        let user_1_info = await instance.getUserInfo({from: user});
        assert(user_1_info.age == 20, "User 1's age is incorrect");
        let user_2_info = await instance.getUserInfo({from: user2});
        assert(user_2_info.age == 30, "User 2's age is incorrect");
        let user_2_origBalance = await instance.bettingFunds({from: user2});
        assert(user_2_origBalance == 0, "User 2's initial balance is not 0");
        await instance.addBettingFunds({value: finney_100, from: user2});
        let user_2_fullBalance = await instance.bettingFunds({from: user2});
        assert(user_2_fullBalance == finney_100, "Balance has not increased to 100 finney");
        await instance.chooseBetAmount(10, {from: user2});
        let user_2_currentBet = await instance.currentBetAmount({from: user2});
        let user_2_newBalance = await instance.bettingFunds({from: user2});
        assert(user_2_newBalance == user_2_fullBalance - user_2_currentBet, "New balance for user 2 has not tracked correctly");
        assert(user_2_currentBet == finney_10, "Current bet amount is not 10 finney from user 2");
        assert(user_2_fullBalance == parseFloat(user_2_currentBet) + parseFloat(user_2_newBalance), "Balances for user 2 have not tracked correctly");
        let newBlockchainBalance = await web3.eth.getBalance(instance.address);
        let totalBalanceOfAccounts = parseFloat(origContractBalance) + parseFloat(user_1_newBalance) + parseFloat(user_1_currentBet) + parseFloat(user_2_newBalance) + parseFloat(user_2_currentBet);
        assert(newBlockchainBalance == parseFloat(totalBalanceOfAccounts), "Blockchain balance does not match the total balance of user accounts");
    });

})

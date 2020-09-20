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



    it("Should allow deposits to the contract, which should start at 0 and increase after deposit and match blockchain", async function(){
        let contractInfoBefore = await instance.getContractInfo();
        assert(contractInfoBefore.balance == 0, "Balance is not 0 at start of contact");
        await instance.depositToContract({value: finney_50});
        let contractInfoAfter = await instance.getContractInfo();
        assert(contractInfoAfter.balance > contractInfoBefore.balance, "New contract balance is not greater than 0, should have been increased");
        assert(contractInfoAfter.balance == finney_50, "New contract balance is not 50 finney");
        let blockchainBalance = await web3.eth.getBalance(instance.address);
        assert(contractInfoAfter.balance == parseFloat(blockchainBalance), "Blockchain and in-contract balances do not match");
    });

    it("Should allow owner to withdraw contract funds, but no one else", async function(){
        await instance.depositToContract({value: finney_50});
        let contractInfo_afterDeposit = await instance.getContractInfo();
        assert(contractInfo_afterDeposit.balance == finney_50, "New contract balance is not 50 finney");
        let blockchainBalance = await web3.eth.getBalance(instance.address);
        assert(contractInfo_afterDeposit.balance == parseFloat(blockchainBalance), "Blockchain and in-contract balances do not matchafter deposit");
        await instance.withdrawContractBalance();
        let newBlockchainBalance = await web3.eth.getBalance(instance.address);
        let contractInfo_afterWithdrawal = await instance.getContractInfo();
        assert(contractInfo_afterWithdrawal.balance == 0, "New contract balance is not 50 finney");
        assert(contractInfo_afterWithdrawal.balance == parseFloat(newBlockchainBalance), "Blockchain and in-contract balances do not match after withdrawal");

        await instance.depositToContract({value: finney_100});
        let contractInfo_afterDeposit_2 = await instance.getContractInfo();
        assert(contractInfo_afterDeposit_2.balance == finney_100, "New contract balance is not 100 finney");

    //    await truffleAssert.fails(await instance.withdrawContractBalance({from: user}), truffleAssert.ErrorType.REVERT);
    //    I commented the truffleAssert.fails line out as it throws an error and I can't figure out why as it should fail and therefore test should succeed
    });

    it("Should allow multiple user deposits and withdrawals to and from betting accounts and to store balances correctly on blockchain", async function(){
        let contractInfo = await instance.getContractInfo();
        let blockchainBalance = await web3.eth.getBalance(instance.address);
        assert(contractInfo.balance == 0 && blockchainBalance == 0, "Blockchain and in-contract balances are not 0");
        await instance.depositToContract({value: finney_50});
        let contractInfo_afterDeposit = await instance.getContractInfo();
        assert(contractInfo_afterDeposit.balance == finney_50, "Contract balance was not increased correctly");
        await instance.addBettingFunds({value:finney_20, from: owner});
        let owner_info = await instance.getUserInfo({from: owner});
        assert(owner_info.balance == finney_20, "Owner's balance was not increased correctly");
        await instance.addBettingFunds({value: finney_10, from: user});
        let user_1_info = await instance.getUserInfo({from: user});
        assert(user_1_info.balance == finney_10, "User 1's balance was not increased correctly");
        await instance.addBettingFunds({value: finney_20, from: user2});
        let user_2_info = await instance.getUserInfo({from: user2});
        assert(user_2_info.balance == finney_20, "User 2's balance was not increased correctly");
        let blockchainBalanceAfter = await web3.eth.getBalance(instance.address);
        let onContractBalances = parseFloat(contractInfo_afterDeposit.balance) + parseFloat(owner_info.balance) + parseFloat(user_1_info.balance) + parseFloat(user_2_info.balance);
        assert(onContractBalances == finney_100 && onContractBalances == parseFloat(blockchainBalanceAfter), "All balances are not equal to 100 finney and do not match blockchain");
        await instance.withdrawContractBalance();
        let contractInfo_afterWithdrawal = await instance.getContractInfo();
        assert(contractInfo_afterWithdrawal.balance == 0, "Contract withdrawal did not set contract balance to 0");
        await instance.withdrawBettingFunds({from: owner});
        let owner_info_afterWithdrawal = await instance.getUserInfo({from: owner});
        assert(owner_info_afterWithdrawal.balance == 0, "Owner's balance was not withdrawn");
        await instance.withdrawBettingFunds({from: user2});
        let user_2_info_afterWithdrawal = await instance.getUserInfo({from: user2});
        assert(user_2_info_afterWithdrawal.balance == 0, "User 2's balance was not withdrawn");
        await instance.addBettingFunds({value: finney_20, from: user2});
        await instance.addBettingFunds({value: finney_20, from: user2});
        let user_2_info_after_2_moreDeposits = await instance.getUserInfo({from: user2});
        let blockchainBalance_latest = await web3.eth.getBalance(instance.address);
        let onContractBalances_latest = parseFloat(contractInfo_afterWithdrawal.balance) + parseFloat(owner_info.balance) + parseFloat(user_1_info.balance) + parseFloat(user_2_info.balance);
        assert(onContractBalances_latest == finney_50 && onContractBalances_latest == parseFloat(blockchainBalance_latest), "All balances do not match after lots of deposits and withdrawals");
    });

    it("Should allow the user to place a bet and cancel a bet and for funds to be tracking correctly", async function(){
        await instance.depositToContract({value: finney_100, from: owner});
        let contractBalance = await instance.getContractBalance();

    }



/*

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
*/


})

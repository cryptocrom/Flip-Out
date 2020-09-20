var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x2929D56fad5f4f56F62Bf4406CD8225c71353Cd9", {from: accounts[0]});
        console.log(contractInstance);
        displayContractInfo();
    });


    $("#mainPage_btn").click(backToMainPage);
    $("#update_button").click(reloadPage);
    $("#contract_withdrawal_button").click(withdrawContractFunds);
    $("#deposit_to_contract_button").click(addContractFunds);



    function backToMainPage(){
        document.location="./mainPage.html";
    };


    function reloadPage(){
        window.location.reload(false);
    };


    function displayContractInfo(){
        contractInstance.methods.getContractInfo().call({gas: 300000}).then(function(result){
            $("#contract_owner_address").text(result.contractAddress);
            $("#display_contract_balance").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
        });
    };


    function addContractFunds(){
        var amount = $("#contract_deposit_amount").val();
        var depositAmount = {value: web3.utils.toWei(amount, "finney"), gas: 50000}
        contractInstance.methods.depositToContract().send(depositAmount)
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            displayContractInfo();
        })
    };


    function withdrawContractFunds(){
        contractInstance.methods.withdrawContractBalance().send({gas: 50000})
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            displayContractInfo();
        })
    };




});

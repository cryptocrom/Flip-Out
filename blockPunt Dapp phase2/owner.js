var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(blockPunt_abi, "0xC62720e1Ea6Ee5f23C3e77C65E6CD2951a020810", {from: accounts[0]});
        console.log(contractInstance);
        displayContractInfo();
    });


    $("#mainPage_btn").click(backToMainPage);
    $("#update_button").click(reloadPage);
    $("#contract_withdrawal_button").click(withdrawContractFunds);
    $("#deposit_to_contract_button").click(addContractFunds);
    $("#destroy_button").click(showDestroyConfirmation);

    $("#submit_password_destroy").click(requirePassword);
    $("#cancel_password_destroy").click(un_requirePassword);
    $("#destroy_password").click(resetPasswordColor);
    $("#confirm_destroy").click(destroyContract);

    $(".destroy_div").hide();
    $("#confirm_destroy").hide();



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


    function showDestroyConfirmation(){
        $("#destroy_button").hide();
        $(".destroy_div").show();
        $("#destroy_password").show();
        $("#submit_password_destroy").show();
        $("#cancel_password_destroy").show();
        $("#confirm_destroy_message").hide();
        $("#confirm_destroy").hide();
    }


    function requirePassword(){
      var password = $("#destroy_password").val();
      if (password == "destroy1"){
          confirmDestroy();
      } else {
          $("#destroy_password").css({"color":"rgb(255, 0, 0, 0.7)", "border-color":"rgb(255, 0, 0, 0.7)"});
      }
    };


    function un_requirePassword(){
        $(".destroy_div").hide();
        $("#confirm_destroy_message").hide();
        $("#confirm_destroy").hide();
        $("#destroy_button").show();
    };


    function resetPasswordColor(){
        $("#owner_password").css({"color":"white", "border-color":"white"});
    };


    function confirmDestroy(){
        $("#submit_password_destroy").hide();
        $("#confirm_destroy_message").show();
        $("#confirm_destroy").show();
    }


    function destroyContract(){
        contractInstance.methods.Destroy().send({gas: 30000})
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            console.log("Contract Destroyed");
        })
    };


});

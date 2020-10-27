var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(blockPunt_abi, "0xC62720e1Ea6Ee5f23C3e77C65E6CD2951a020810", {from: accounts[0]});
        console.log(contractInstance);
        updateAccounts();
    });





/* all buttons */
    $("#goto_rules_page_button").click(gotoRulesPage);
    $("#flip_out_button").click(gotoFlipOut);
    $("#roll_out_button").click(gotoRollOut);
    $("#draw_out_button").click(gotoDrawOut);

    $("#update_button").click(reloadPage);
    $("#deposit_button").click(addFunds);
    $("#withdraw_betting_funds_button").click(withdrawFunds);

    $("#owner_page_button").click(showPassword);
    $("#submit_password").click(requirePassword);
    $("#cancel_password").click(un_requirePassword);
    $("#owner_password").click(resetPasswordColor);

    $(".owner_password_div").hide();


    function gotoRulesPage(){
        document.location="./rules.html";
    };


    function gotoFlipOut(){
        document.location="./flipOut.html";
    };


    function gotoRollOut(){
        document.location="./rollOut.html";
    };


    function gotoDrawOut(){
        document.location="./drawOut.html";
    };


    function ownerPage(){
        document.location="./owner.html";
    };


    function reloadPage(){
        window.location.reload(false);
    };


    function showPassword(){
        $("#owner_page_button").hide();
        $(".owner_password_div").show();
        resetPasswordColor();
    };


    function requirePassword(){
      var password = $("#owner_password").val();
      if (password == "ownerOnly1"){
          ownerPage();
      } else {
          $("#owner_password").css({"color":"rgb(255, 0, 0, 0.7)", "border-color":"rgb(255, 0, 0, 0.7)"});
      }
    };


    function un_requirePassword(){
        $(".owner_password_div").hide();
        $("#owner_page_button").show();
    };


    function resetPasswordColor(){
        $("#owner_password").css({"color":"white", "border-color":"white"});
    };


    function addFunds(){
        var amount = $("#deposit_amount").val();
        if (amount > 0){
            var depositAmount = {value: web3.utils.toWei(amount, "finney"), gas: 100000};
            contractInstance.methods.addBettingFunds().send(depositAmount)
            .on("transactionHash", function(hash){
                console.log(hash);
            })
            .on("confirmation", function(confirmationNr){
                console.log(confirmationNr);
            })
            .on("receipt", function(receipt){
                console.log(receipt);
                updateAccounts();
            });
        };
    };


    function withdrawFunds(){
        contractInstance.methods.withdrawBettingFunds().send({gas: 50000})
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            updateAccounts();
        })
    };


    function updateAccounts() {
        displayUserInfo();
        displayContractInfo();
    };


    function displayUserInfo(){
        contractInstance.methods.getUserInfo().call({gas: 30000}).then(function(result){
            $("#display_user_account").text(result.user);
            $("#display_betting_funds").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
        });
    };


    function displayContractInfo(){
        contractInstance.methods.getContractInfo().call({gas: 300000}).then(function(result){
            $("#contract_owner_address").text(result.contractAddress);
            $("#display_contract_balance").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
        });
    };


});

var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x2929D56fad5f4f56F62Bf4406CD8225c71353Cd9", {from: accounts[0]});
        console.log(contractInstance);
        updateAccounts();
    });

    var choice;
    var bet = 0;
    var balanceBefore;
    var balanceAfter;
    var rollResult;

/* all buttons */
    $("#goto_rules_page_button").click(gotoRulesPage);
    $("#back_to_main_button").click(backToMainPage);
    $("#flip_out_btn").click(gotoFlipOut);
    $("#draw_out_btn").click(gotoDrawOut);
    $("#update_button").click(reloadPage);

    $("#place_bet_button").click(placeBet);
    $("#one_button").click(betOnOne);
    $("#two_button").click(betOnTwo);
    $("#three_button").click(betOnThree);
    $("#four_button").click(betOnFour);
    $("#five_button").click(betOnFive);
    $("#six_button").click(betOnSix);
    $("#cancel_button").click(resetBetting);
    $("#roll_it_button").click(rollTheDice);

    $("#Dice_Roll_GIF").hide();
    $(".message").hide();
    $(".cancel_section").hide();
    $(".choice_btns").hide();
    $(".amount_display").hide();
    $(".do_it_btns").hide();

    $("#owner_page_button").click(showPassword);
    $("#submit_password").click(requirePassword);
    $("#cancel_password").click(un_requirePassword);
    $("#owner_password").click(resetPasswordColor);

    $(".owner_password_div").hide();


    function gotoRulesPage (){
        document.location="./rules.html";
    };


    function backToMainPage(){
        document.location="./mainPage.html";
    };

    function gotoFlipOut(){
        document.location="./flipOut.html";
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


    function placeBet(){
        var betAmount = $("#bet_amount").val();
        if (betAmount > 0){
            $(".bet_amount_section").hide();
            $(".cancel_section").show();
            $(".choice_btns").show();
            $(".amount_display").show();
            $("#display_bet_amount").css({"border-color":"white"});
            $("#display_bet_amount").text(betAmount + " Finney");
            bet = betAmount;
        };

    };


    function betOnOne(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        choice = 1;
    };


    function betOnTwo(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        choice = 2;
    };


    function betOnThree(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        choice = 3;
    };


    function betOnFour(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        choice = 4;
    };


    function betOnFive(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        choice = 5;
    };


    function betOnSix(){
        $(".do_it_btns").show();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        choice = 6;
    };


    function rollTheDice(){
        if (bet > 0 && (choice >= 1 && choice <=6)){
            balanceBeforeBet();
            setBet();
        };
    };


    function setBet(){
        contractInstance.methods.rollIt(bet, choice).send({gas: 100000})
        .on("transactionHash", function(hashRoll){
            console.log(hashRoll);
        })
        .on("confirmation", function(confirmationRoll){
            console.log(confirmationRoll);
        })
        .on("receipt", function(receiptRoll){
            console.log(receiptRoll);
            lastBetChoice = 0;
            rollResult = "N/A";
            diceRollGif();
        })
    };


    function diceRollGif(){
      $(".cancel_section").hide();
      $(".do_it_btns").hide();
      $(".choice_btns").hide();
      ($("#Dice_Roll_GIF").height(330)).show().then(noGif());
    };


    function noGif(){
        setTimeout(function () {
            $("#display_bet_amount").css({"border-color":"black"});
            $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#Dice_Roll_GIF").hide();
            if(bet > 0 && choice >= 1 && choice <= 6){
                results();
                balanceAfterBet();
            };
      }, 3000)
    };


    function results(){
        bet = 0;
        choice = "No selection made";
        updateAccounts();
    };


    function balanceBeforeBet(){
        contractInstance.methods.getUserInfo().call({gas: 30000}).then(function(resB){
            balanceBefore = web3.utils.fromWei(resB.balance, "finney")
        });
    };


    function balanceAfterBet(){
        contractInstance.methods.getUserInfo().call({gas: 30000}).then(function(resA){
            balanceAfter = web3.utils.fromWei(resA.balance, "finney");
            let balBef = balanceBefore;
            let balAft = balanceAfter;

            if(balAft > balBef){
                showCongratulationsMessage();
            } else if (balAft < balBef) {
                showCondolencesMessage();
            };
            balBef = 0;
            balAft = 0;
        });
    };


    function showCongratulationsMessage(){
        $(".amount_display").hide();
        let amountUp = (balanceAfter - balanceBefore);
        $("#roll_result").text("You rolled a " + rollResult);
        $("#roll_result").show();
        $("#win_or_lose_message")
        .text("Congratulations, you're up " + amountUp + " Finney")
        .then($(".message").show()
        .then(noMessage()));
    };


    function showCondolencesMessage(){
        $(".amount_display").hide();
        $("#roll_result").text("You rolled a " + rollResult);
        $("#roll_result").show();
        $("#win_or_lose_message")
        .text("Thanks for the contribution!")
        .then($(".message").show()
        .then(noMessage()));
    };


    function noMessage(){
        setTimeout(function () {
            resetBetting();
        }, 4000);
    };


    function resetBetting(){
        $("#display_bet_amount").css({"border-color":"black"});
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $(".message").hide();
        $(".bet_amount_section").show();
        $(".cancel_section").hide();
        $(".amount_display").hide();
        $(".do_it_btns").hide();
        $(".choice_btns").hide();
        bet = 0;
        choice = "No selection made";
        updateAccounts();
    };


    function updateAccounts() {
        displayResult();
        displayUserInfo();
        displayContractInfo();
    };


    function displayUserInfo(){
        contractInstance.methods.getUserInfo().call({gas: 30000}).then(function(result){
            $("#display_user_account").text(result.user);
            $("#display_betting_funds").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
            $("#display_bet_amount").text(bet + " Finney");
        });
    };


    function displayContractInfo(){
        contractInstance.methods.getContractInfo().call({gas: 30000}).then(function(result){
            $("#contract_owner_address").text(result.contractAddress);
            $("#display_contract_balance").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
        });
    };


    function displayResult(){
        contractInstance.methods.getResults().call({gas: 30000}).then(function(result){
            rollResult = result.rollOut;
        });
    };

});

var web3 = new Web3(Web3.givenProvider);
var contractInstance;

/* for bet functions and displays */
var playerAddress;
var currentUserBalance;
var choice;
var bet;
var amountGained;
var flipResult;
var query_Id;
var incomingQueryId;
var blockNumber;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(blockPunt_abi, "0xC62720e1Ea6Ee5f23C3e77C65E6CD2951a020810", {from: accounts[0]});
        console.log(contractInstance);
        updateAccounts();

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

    /* hidden elements until called */
        $("#Dice_Roll_GIF").hide();
        $(".message").hide();
        $(".cancel_section").hide();
        $(".choice_btns").hide();
        $(".amount_display").hide();
        $(".do_it_btns").hide();
        $("#crypto_GIF").hide();
        $("#Commandments_Img").hide();

    /* owner page button */
        $("#owner_page_button").click(showPassword);
        $("#submit_password").click(requirePassword);
        $("#cancel_password").click(un_requirePassword);
        $("#owner_password").click(resetPasswordColor);

        $(".owner_password_div").hide();



    /* event listeners */

        contractInstance.events.BetPlaced({
            filter: {player: playerAddress},
            fromBlock: 'latest'
        },
        function(error, event){
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
            $(".amount_display").hide();
            $(".bet_amount_section").hide();
            $(".cancel_section").hide();
            $(".choice_btns").hide();
            $("#crypto_GIF").hide();
            $("#roll_result").text("Your bet has been confirmed, thank you...");
            $("#roll_result").show();
            $("#win_or_lose_message")
            .text("Please allow us to make sure the dice has not been tampered with.  Feel free to brush up on the 10 commandments while you wait...");
            $(".message").show();
            setTimeout(function(){
                changeWaitingMaterial();
            }, 500);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log(receipt);
            $("#win_or_lose_message")
            .text("The transaction has failed, try changing the gas amount or price and try again");
            $(".message").show();
            setTimeout(function(){
                resetBetting();
            }, 5000);
        });


        contractInstance.events.RollNumberReceived({
            player: 'playerAddress',
            fromBlock: 'latest'
        },
        function(error, event){
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
            incomingQueryId = event.returnValues.queryId;
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log(receipt);
        });


        contractInstance.events.RollOutResults({
            player: 'playerAddress',
            fromBlock: 'latest'
        },
        function(error, event){
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
            rollResult = event.returnValues.rollResult;
            choice = events.returnValues.choice;
            var bet_amount = web3.utils.fromWei(event.returnValues.betAmount, "finney");
            var winner = event.returnValues.winner;
            if (winner == "Player") {
                amountGained = bet_amount;
            } else {
                amountGained = 0;
            };
            query_Id = event.returnValues.queryId;
            if(query_Id == incomingQueryId){
                setTimeout(function(){
                    $("#Commandments_Img").hide();
                    $("#display_bet_amount").text(bet_amount + " Finney");
                    $(".amount_display").show();
                    $("#roll_result").text("Good news!!");
                    $("#roll_result").show();
                    $("#win_or_lose_message")
                    .text("The dice checked out, commencing roll - good luck...");
                    $(".message").show();
                    setTimeout(function(){
                        diceRollGif();
                    }, 3000);
                }, 500);
            }
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log(receipt);
        });






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
            setBet();
        };
    };


    function setBet(){
        contractInstance.methods.rollIt(bet, choice).send({gas: 300000})
        .on("transactionHash", function(hash){
            console.log(hash);
            waitForConfirmation();
        })
        .on("receipt", function(receipt){
            console.log(receipt);
        })
    };


/* Shows gif while waiting for transaction verification */
    function waitForConfirmation(){
        $(".cancel_section").hide();
        $(".do_it_btns").hide();
        $(".choice_btns").hide();
        $("#roll_result").text("We just need to verify your transaction");
        $("#roll_result").show();
        $("#win_or_lose_message")
        .text("Please enjoy this gif while you wait....");
        $(".message").show();
        setTimeout(function(){
            $(".message").hide();
            $("#crypto_GIF").show();
        }, 5000);
    };

/* Shows ten crypto commandments while waiting for callback */
    function changeWaitingMaterial(){
        setTimeout(function(){
            $(".amount_display").hide();
            $(".bet_amount_section").hide();
            $(".cancel_section").hide();
            $(".choice_btns").hide();
            $(".message").hide();
            $("#crypto_GIF").hide();
            $("#Commandments_Img").show();
        }, 6000)
    };







/* show dice roll gif */
    function diceRollGif(){
        $("#roll_result").text("");
        $(".message").hide();
        ($("#Dice_Roll_GIF").height(330)).show().then(noGif());
    };



/* end gif, show display message */
    function noGif(){
        setTimeout(function () {
            $("#Dice_Roll_GIF").hide();
            $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $("#Dice_Roll_GIF").hide();
            updateAccounts();
            displayResults();
      }, 3000)
    };


    function displayResults(){
        $(".amount_display").hide();
        if (amountGained > 0){
            setTimeout(function(){
                $("#roll_result").text(rollResult);
                $("#roll_result").show();
                $("#win_or_lose_message")
                .text("Congratulations, you're up " + amountGained + " Finney")
                .then($(".message").show()
                .then(noMessage()));
            }, 250);
        } else {
            setTimeout(function(){
                $("#roll_result").text(rollResult);
                $("#roll_result").show();
                $("#win_or_lose_message")
                .text("Unfortunately you chose, " + choice + " ....thanks for the contribution")
                .then($(".message").show()
                .then(noMessage()));
            }, 250);
        };
    };


    function noMessage(){
        setTimeout(function () {
            resetBetting();
        }, 4000);
    };



/* resets page to show original bet buttons only */
    function resetBetting(){
        $(".message").hide();
        $(".bet_amount_section").show();
        $("#choose_label").show();
        $("#bet_amount").show()
        $("#place_bet_button").show();
        $(".cancel_section").hide();
        $(".amount_display").hide();
        $("#display_bet_amount").css({"border-color":"black"});
        $(".do_it_btns").hide();
        $("#one_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#two_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#three_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#four_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#five_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $("#six_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $(".choice_btns").hide();
        $("#Dice_Roll_GIF").hide();
        $("#crypto_GIF").hide();
        $("#Commandments_Img").hide();
        bet = 0;
        choice = "No selection made";
        updateAccounts();
    };



/* calls to contract */
    function updateAccounts() {
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
  });
});

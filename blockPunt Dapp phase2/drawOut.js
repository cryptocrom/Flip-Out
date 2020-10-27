var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(blockPunt_abi, "0xC62720e1Ea6Ee5f23C3e77C65E6CD2951a020810", {from: accounts[0]});
        console.log(contractInstance);
        updateAccounts();
    });

    var bet = 0;
    var balanceBefore;
    var balanceAfter;
    var houseDrawResult;
    var userDrawResult;
    var choice;

/* all buttons */
    $("#goto_rules_page_button").click(gotoRulesPage);
    $("#back_to_main_button").click(backToMainPage);
    $("#flip_out_btn").click(gotoFlipOut);
    $("#roll_out_btn").click(gotoRollOut);
    $("#update_button").click(reloadPage);
    $("#place_bet_button").click(placeBet);
    $("#cancel_button").click(resetBetting);
    $("#draw_it_button").click(drawTheDealerCard);
    $("#high_button").click(selectHigher);
    $("#low_button").click(selectLower);
    $("#hit_me_button").click(userCard);

    $("#Draw_Card_GIF").hide();
    $(".dealer_card_result").hide();
    $(".user_card_result").hide();
    $(".cancel_section").hide();
    $(".hiLo_btns").hide();
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
    }


    function gotoRollOut(){
        document.location="./rollOut.html";
    }


    function ownerPage(){
        document.location="./owner.html";
    }


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
            $(".dealer_draw").show();
            $(".amount_display").show();
            $("#display_bet_amount").css({"border-color":"white"});
            bet = betAmount;
            $("#display_bet_amount").text(bet + " Finney");
        };
    };


    function drawTheDealerCard(){
        if (bet > 0){
            setBet();
        };
    };


    function setBet(){
        balanceBeforeBet();
        contractInstance.methods.drawHouseCard(bet).send({gas: 100000})
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("confirmation", function(confirmation){
            console.log(confirmation);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            userDrawResult = "N/A";
            houseDrawResult = "N/A";
            houseCardDrawGIF();
        })
    };


    function houseCardDrawGIF(){
      $(".cancel_section").hide();
      $(".dealer_draw").hide();
      ($("#Draw_Card_GIF").width(360)).show().then(noGif_dealer());
    };


    function noGif_dealer(){
        setTimeout(function(){
            $("#Draw_Card_GIF").hide();
            getDealerCard();
        }, 3000)
    };


    function getDealerCard(){
        contractInstance.methods.getResults().call({gas: 30000}).then(function(result){
            houseDrawResult = result.drawOutHouse;
            showOptions();
        });
    };


    function showOptions(){
        results();
        $("#display_bet_amount").text(bet + " Finney");
        var card = houseDrawResult;
        if (card == 1) card = "Ace";
        if (card == 11) card = "Jack";
        if (card == 12) card = "Queen";
        if (card == 13) card = "King";
        $("#dealer_card").text("Dealer card: " + card);
        $(".dealer_card_result").show();
        if (card == "Ace" || card == "King"){
            $("#high_low_message").text("No options available on Aces and Kings, you're bet has been returned");
            noMessage();
        } else {
            $("#high_low_message").text("Choose below whether you think you're card will be higher or lower than the dealer's card");
            $(".hiLo_btns").show();
        };
    };


    function selectHigher(){
        choice = true;
        $("#high_button").css({"color":"black", "background-color":"#00FF00", "border":"2px solid #00FF00"});
        $("#low_button").css({"color":"orange", "background-color":"black", "border":"2px solid orange"});
        $(".user_draw").show();
    };


    function selectLower(){
        choice = false;
        $("#low_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
        $("#high_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $(".user_draw").show();
    };


    function userCard(){
        contractInstance.methods.drawUserCard(choice).send({gas: 100000})
        .on("transactionHash", function(hash){
            console.log(hash);
        })
        .on("confirmation", function(confirmation){
            console.log(confirmation);
        })
        .on("receipt", function(receipt){
            console.log(receipt);
            getUserCard();
        })
    };


    function getUserCard(){
        contractInstance.methods.getResults().call({gas: 30000}).then(function(result){
            userDrawResult = result.drawOutUser;
            $(".hiLo_btns").hide();
            userCardDrawGIF();
        });
    };


    function userCardDrawGIF(){
        $(".cancel_section").hide();
        $(".user_draw").hide();
        $(".dealer_card_result").hide();
        ($("#Draw_Card_GIF").width(360)).show().then(noGif());
    };


    function noGif(){
        setTimeout(function(){
            $(".hiLo_btns").hide();
            $(".dealer_card_result").show();
            $("#display_bet_amount").css({"border-color":"black"});
            $("#Draw_Card_GIF").hide();
            bet = 0;
            results();
            balanceAfterBet();
        }, 3300)
    };


    function results(){
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
        if (balanceAfter > balanceBefore) {
            let amountUp = (balanceAfter - balanceBefore);
            if (userDrawResult == 1) userDrawResult = "Ace";
            if (userDrawResult == 11) userDrawResult = "Jack";
            if (userDrawResult == 12) userDrawResult = "Queen";
            if (userDrawResult == 13) userDrawResult = "King";
            $("#user_card").text("You're card: " + userDrawResult);
            $("#result_message")
            .text("Congratulations, you're up " + amountUp + " Finneys")
            .then($(".user_card_result").show()
            .then(noMessage()));
        } else {
            showCondolencesMessage()
        };
    };


    function showCondolencesMessage(){
        if (userDrawResult == 1) userDrawResult = "A";
        if (userDrawResult == 11) userDrawResult = "J";
        if (userDrawResult == 12) userDrawResult = "Q";
        if (userDrawResult == 13) userDrawResult = "K";
        $("#user_card").text("You're card: " + userDrawResult);
        $("#result_message")
        .text("Thanks for the contribution!")
        .then($(".user_card_result").show()
        .then(noMessage()));
    };


    function noMessage(){
        setTimeout(function () {
            resetBetting();
        }, 6000);
    };


    function resetBetting(){
        $("#display_bet_amount").css({"border-color":"black"});
        $(".dealer_card_result").hide();
        $(".user_card_result").hide();
        $(".bet_amount_section").show();
        $(".cancel_section").hide();
        $(".amount_display").hide();
        $(".do_it_btns").hide();
        $("#low_button").css({"color":"orange", "background-color":"black", "border":"2px solid orange"});
        $("#high_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
        $(".hiLo_btns").hide();
        bet = 0;
        choice = "No selection made";
        updateAccounts();
    }


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

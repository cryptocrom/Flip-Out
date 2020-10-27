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

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(blockPunt_abi, "0xC62720e1Ea6Ee5f23C3e77C65E6CD2951a020810", {from: accounts[0]});
        console.log(contractInstance);
        updateAccounts();


    /* link buttons */
        $("#goto_rules_page_button").click(gotoRulesPage);
        $("#back_to_main_button").click(backToMainPage);
        $("#roll_out_btn").click(gotoRollOut);
        $("#draw_out_btn").click(gotoDrawOut);
        $("#update_button").click(reloadPage);
    /* game buttons */
        $("#place_bet_button").click(placeBet);
        $("#heads_button").click(betHeads);
        $("#tails_button").click(betTails);
        $("#cancel_button").click(resetBetting);
        $("#flip_it_button").click(flipThatCoin);

    /* hidden elements until called */
        $("#Coin_Flip_GIF").hide();
        $(".message").hide();
        $(".cancel_section").hide();
        $(".choice_btns").hide();
        $(".amount_display").hide();
        $(".do_it_btns").hide();
        $("#Bitcoin_GIF").hide();
        $("#Commandments_Img").hide();

    /* owner page button */
        $("#owner_page_button").click(showPassword);
        $("#submit_password").click(requirePassword);
        $("#cancel_password").click(un_requirePassword);
        $("#owner_password").click(resetPasswordColor);
        $(".owner_password_div").hide();



    /* page links */
        function gotoRulesPage (){
            document.location="./rules.html";
        };

        function backToMainPage(){
            document.location="./mainPage.html";
        };

        function gotoRollOut(){
            document.location="./rollOut.html";
        }

        function gotoDrawOut(){
            document.location="./drawOut.html";
        }

        function ownerPage(){
            document.location="./owner.html";
        }

        function reloadPage(){
            window.location.reload(false);
        };




    /* owner page link password */
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





    /* bet section */
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


        function betHeads(){
            $(".do_it_btns").show();
            $("#heads_button").css({"color":"black", "background-color":"orange", "border":"2px solid orange"});
            $("#tails_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            choice = 1;
        };


        function betTails(){
            $(".do_it_btns").show();
            $("#heads_button").css({"color":"orange", "background-color":"black", "border":"2px solid orange"});
            $("#tails_button").css({"color":"black", "background-color":"#00FF00", "border":"2px solid #00FF00"});
            choice = 0;
        };


        function flipThatCoin(){
            if (bet > 0 && (choice == 0 || choice == 1)){
                setBet();
            };
        };


        function setBet(){
            contractInstance.methods.flipIt(bet, choice).send({gas: 400000})
            .on("transactionHash", function(hash){
                console.log(hash);
                waitForConfirmation();
            })
            .on("receipt", function(receipt){
                console.log(receipt);
            })
            .on("error", function(error){
                console.log(error);
                resetBetting();
            })
        };

    /* Shows gif while waiting for transaction verification */
        function waitForConfirmation(){
            $(".cancel_section").hide();
            $(".do_it_btns").hide();
            $(".choice_btns").hide();
            $("#flip_result").text("We just need to verify your transaction");
            $("#flip_result").show();
            $("#win_or_lose_message")
            .text("Please enjoy this gif while you wait....");
            $(".message").show();
            setTimeout(function(){
                $(".message").hide();
                $("#Bitcoin_GIF").show();
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
                $("#Commandments_Img").show();
            }, 6000)
        };





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
            $("#Bitcoin_GIF").hide();
            $("#flip_result").text("Your bet has been confirmed, thank you...");
            $("#flip_result").show();
            $("#win_or_lose_message")
            .text("Please allow us to make sure the coin has not been tampered with.  Feel free to brush up on the 10 commandments while you wait...");
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


        contractInstance.events.FlipNumberReceived({
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


        contractInstance.events.FlipOutResults({
            player: 'playerAddress',
            fromBlock: 'latest'
        },
        function(error, event){
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
            flipResult = event.returnValues.flipResult;
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
                    $("#flip_result").text("Good news!!");
                    $("#flip_result").show();
                    $("#win_or_lose_message")
                    .text("The coin checked out, commencing flip - good luck...");
                    $(".message").show();
                    setTimeout(function(){
                        coingFlipGif();
                    }, 300);
                }, 500);
            }
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log(receipt);
        });




    /* show coin flip gif */
        function coingFlipGif(){
            setTimeout(function(){
                $("#flip_result").text("");
                $(".message").hide();
                $("#Coin_Flip_GIF").show();
                noGif();
            }, 5000)
        };


    /* end gif, show display message */
        function noGif(){
            setTimeout(function () {
                $("#Coin_Flip_GIF").hide();
                updateAccounts();
                displayResults();
          }, 3000)
        };


        function displayResults(){
            $(".amount_display").hide();
            if (amountGained > 0){
                setTimeout(function(){
                    $("#flip_result").text(flipResult);
                    $("#flip_result").show();
                    $("#win_or_lose_message")
                    .text("Congratulations, you're up " + amountGained + " Finney")
                    .then($(".message").show()
                    .then(noMessage()));
                }, 250);
            } else {
                setTimeout(function(){
                    $("#flip_result").text(flipResult);
                    $("#flip_result").show();
                    $("#win_or_lose_message")
                    .text("Thanks for the contribution")
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
            $("#heads_button").css({"color":"orange", "background-color":"black", "border":"2px solid orange"});
            $("#tails_button").css({"color":"#00FF00", "background-color":"black", "border":"2px solid #00FF00"});
            $(".choice_btns").hide();
            $("#Coin_Flip_GIF").hide();
            $("#Bitcoin_GIF").hide();
            $("#Commandments_Img").hide();
            bet = 0;
            choice = "No selection made";
            updateAccounts();
        };



    /* calls to contract */
        function updateAccounts(){
            updateUserInfo();
            updateContractInfo();
        };


        function updateUserInfo(){
            contractInstance.methods.getUserInfo().call().then(function(result){
                $("#display_user_account").text(result.user);
                $("#display_betting_funds").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
                $("#display_bet_amount").text(bet + " Finney");
                playerAddress = result.user;
                currentUserBalance = web3.utils.fromWei(result.balance, "finney");
                $("#display_locked_user_funds").text(web3.utils.fromWei(result.pendingBets, "finney") + " Finney");
            });
        };


        function updateContractInfo(){
            contractInstance.methods.getContractInfo().call().then(function(result){
                $("#contract_owner_address").text(result.contractAddress);
                $("#display_contract_balance").text(web3.utils.fromWei(result.balance, "finney") + " Finney");
            });
        };

    });
});

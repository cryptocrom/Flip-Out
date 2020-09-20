$(document).ready(function(){

    $("#back_to_main_button").click(backToMainPage);
    $("#flip_out_btn").click(gotoFlipOut);
    $("#roll_out_btn").click(gotoRollOut);
    $("#draw_out_btn").click(gotoDrawOut);


    $("#show_rules_flipOut").click(showFlipOutRules);
    $("#hide_rules_flipOut").click(hideFlipOutRules);
    $("#show_rules_rollOut").click(showRollOutRules);
    $("#hide_rules_rollOut").click(hideRollOutRules);
    $("#show_rules_drawOut").click(showDrawOutRules);
    $("#hide_rules_drawOut").click(hideDrawOutRules);
    $("#show_payout_table").click(showPayoutTable);
    $("#hide_payout_table").click(hidePayoutTable);


    $(".draw_out_payout_table_div").hide();
    $("#hide_payout_table").hide();
    $(".rules_div").hide();
    $(".hide_buttons").hide();



    function backToMainPage(){
        document.location="./mainPage.html";
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


    function showFlipOutRules(){
        $(".flipOut_rules").show();
        $("#show_rules_flipOut").hide();
        $("#hide_rules_flipOut").show()
    }


    function hideFlipOutRules(){
        $(".flipOut_rules").hide();
        $("#show_rules_flipOut").show();
        $("#hide_rules_flipOut").hide();
    }


    function showRollOutRules(){
        $(".rollOut_rules").show();
        $("#show_rules_rollOut").hide();
        $("#hide_rules_rollOut").show()
    }


    function hideRollOutRules(){
        $(".rollOut_rules").hide();
        $("#show_rules_rollOut").show();
        $("#hide_rules_rollOut").hide();
    }


    function showDrawOutRules(){
        $(".drawOut_rules").show();
        $("#show_rules_drawOut").hide();
        $("#hide_rules_drawOut").show()
    }


    function hideDrawOutRules(){
        $(".drawOut_rules").hide();
        $("#show_rules_drawOut").show();
        $("#hide_rules_drawOut").hide();
        $("#show_payout_table").show();
        $("#hide_payout_table").hide();
        $(".draw_out_payout_table_div").hide();
    }


    function showPayoutTable(){
        $(".draw_out_payout_table_div").show();
        $("#show_payout_table").hide();
        $("#hide_payout_table").show();
    };


    function hidePayoutTable(){
        $(".draw_out_payout_table_div").hide();
        $("#show_payout_table").show();
        $("#hide_payout_table").hide();
    };


});

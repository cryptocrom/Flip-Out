# blockPunt
Coin Flip DApp Project

August 2020
This is my first project that I have ever created.
I have designed a DApp from start to finish to bring the Front End, the Back End and the Blockchain together in a simple Coin Flip DApp.
HTML and CSS for front end
JavaScript (jQuery) used for functionality on front end.
Solidity used for Smart Contract.


**Update - 20 September 2020
I have now completed my project, contracts have been rewritten almost entirely.
I have created extra games (a dice roll game and high card draw game also).
6 webpages (home page, rules page, owner page, and a page for each of the games).
Each page has uniformity and style consistency and interlinks with other pages and the owner page link is protected with a password.
The result messages sometimes spit out the wrong message, but I believe this to be slow communication lag from the contract at times perhaps.
I may need to look into asynchronous functions perhaps?? Its a work in progress.


**Update - 27 October 2020
I have now completed rewriting the contracts to include oracle data for true random number generation instead of pseudo-randomness as used in phase 1.
The project aim was to make a coinflip DApp, I have created 3 games (coin flip, dice roll and high card draw) - all of hich use oracle data.
the high card draw game (Draw Out) uses pseudo-randomness for the house card for hwich the high/low bet will be based upon and then retrieves a random number from the oracle for the user.
I have linked my front end using event listeners and have the coin flip successfully working.  The dice roll (Roll Out) and high card draw (Draw Out) are still to be finished at this stage.

// game.mjs
import {generateDeck, shuffle, deal, handToString, matchesAnyProperty, suits, drawUntilPlayable, ranks} from '../lib/cards.mjs';
import os from 'os';
import {question} from 'readline-sync';
import clear from 'clear';
import {readFile} from 'fs';


// the best way to implement a interactive game is through building a class, like the self. in Python Class, here use class.

class crazyEight {

    constructor(argv) {
        this.gameCount = 0;
        this.runningStatus = true;
        this.turnIndex = 1; // define human automatically starts first, change turns using (-1)^n
        this.nextPlay = {};
        this.discardPile = [];
        this.deckOriginal = shuffle(generateDeck());
        const dealOut = deal(this.deckOriginal);
        this.deck = dealOut.deck;
        this.cards = dealOut.hands;
        this.playerHand = this.cards[0];
        this.computerHand = this.cards[1];
        this.nextPlay = this.deck.pop();
        this.discardPile.push(this.nextPlay)
        let preSet;
        let jsonfile = undefined; // default
        if (argv.length !== 3) {jsonfile = false}
        else{jsonfile = argv[2]}
        // console.log(jsonfile);
        if(jsonfile !== false) {
            readFile(jsonfile, "utf8", (error, data) => {
                try {
                    preSet = JSON.parse(data);
                // console.log(preSet);
                this.deck = preSet['deck'];
                this.playerHand = preSet['playerHand'];
                this.computerHand = preSet['computerHand'];
                this.discardPile = preSet['discardPile'];
                this.nextPlay = preSet['nextPlay'];
                this.main();
                }
                catch (error) {
                    console.log("Error!");
                    let choice = question("Press ENTER to continue...");
                    return;
                }  
            })
        } else if (jsonfile === false){
            this.main()
        }
    }

    Firstdisplay(){
        console.log("             CRAZY 8's  #Turn " + (this.gameCount+1));
        console.log("-----------------------------------------------");
        // console.log(this.nextPlay);
        console.log("Next suit/rank to play: ->  " + this.nextPlay.rank + this.nextPlay.suit);
        console.log("-----------------------------------------------");
        if (this.discardPile.length > 0){
            console.log("Top of discard pile: " + this.discardPile[this.discardPile.length - 1].rank + this.discardPile[this.discardPile.length - 1].suit);
        }else{
            console.log("Top of discard pile: Empty" );
        }
        console.log("Number of cards left in deck: " + this.deck?.length);
        console.log("-----------------------------------------------");
        console.log("Computer hand: " + handToString(this.computerHand));
        console.log("Player hand: " + handToString(this.playerHand));
        console.log("-----------------------------------------------");
    }

    send(i, current){
        let sent = current[i];
        this.discardPile.push(sent);
        // this.deck.pop()
        for (let n = i; n < current.length - 1; n++) {
            current[n] = current[n + 1];
        }
        current.pop();
        if(sent.rank === '8') {
            const sentSuit = this.suitVarPlayer();
            this.nextPlay = {suit: sentSuit, rank: undefined};
        } else {
            this.nextPlay = {...sent};
        }
        return sent;
    }

    suitVarPlayer(){
        console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
        let suitList = Object.values(suits);
        for (let i = 0; i < suitList.length; i++){
            console.log((i+1) + ". " + suitList[i]);
        }
        let intChoice;
        if (this.turnIndex === 1){
            let choice = question(">  ");
            intChoice = parseInt(choice) - 1;
            console.log("You chose to set the suit to " + suitList[intChoice]);
        } else { // computer needs to make decision too
            let compSuit = new Array; 
            for (let i = 0; i < this.computerHand.length; i++){
                compSuit.push(this.computerHand[i].suit);
            }
            intChoice = Math.floor(Math.random() * compSuit.length);
            console.log("Computer chose to set the suit to " + compSuit[intChoice]);
        }
        return suitList[intChoice];
    }

    checkPlayable(current){
        for (let i = 0; i < current.length; i++) {
            let temp = current[i];
            if (matchesAnyProperty(this.nextPlay, temp) || temp.rank === "8") {
                return true;
            }
        }
        return false;
    }

    playerTurn() {
        console.log("Player's turn...");
        if (this.checkPlayable(this.playerHand)===true){
            console.log("Enter the number of the card you would like to play");
            console.log(handToString(this.playerHand, os.EOL, true))
            let status = true;
            let numberInt;
            while (status) {
                let input;
                let numberStr = question(">  ");
                numberInt = parseInt(numberStr) - 1;
                if (matchesAnyProperty(this.playerHand[numberInt], this.nextPlay) || this.playerHand[numberInt].rank === "8"){
                status = false;
                } else {
                    console.log("You can't play this, try again!!! ")
                }
            }
            console.log("You played " + this.playerHand[numberInt].rank + this.playerHand[numberInt].suit)
            this.send(numberInt, this.playerHand)
            
        } else {
            console.log("You have no playable cards");
            console.log("Press ENTER to draw cards until matching " + this.nextPlay.rank + ", " + this.nextPlay.suit + ", " + "8");
            question();
            this.autoDraw(this.playerHand);
        }
        this.turnIndex = this.turnIndex * (-1)
    }

    autoDraw(current){
        // before drawing, gotta check if there is card or not... 
        // wikipedia says we should shuffle the discarded deck EXCEPT the nextPlay...
        if(this.deck.length === 0) {
            let temp = this.discardPile.slice(0, this.discardPile.length - 1);
            this.discardPile = this.discardPile.slice(this.discardPile.length - 1);
            this.deck = shuffle(temp);
        }
        let [newDeck, drawnDeck] = drawUntilPlayable(this.deck, this.nextPlay);
        // console.log(newDeck);
        // console.log(matchesAnyProperty(drawnDeck[drawnDeck.length - 1], this.nextPlay));
        if (newDeck.length === 0 && matchesAnyProperty(drawnDeck[drawnDeck.length - 1], this.nextPlay) === false){
            let temp1 = this.discardPile.slice(0, this.discardPile.length - 1);
            this.discardPile = this.discardPile.slice(this.discardPile.length - 1);
            newDeck = shuffle(temp1);
            // console.log(newDeck);
            let [newDeck1, drawnDeck1] = drawUntilPlayable(newDeck, this.nextPlay);
            this.deck = newDeck1;
            for (let k = 0; k < drawnDeck1.length; k++){drawnDeck.push(drawnDeck1[k])}

        } else {this.deck = newDeck}
        
        console.log("Cards drawn: " + handToString(drawnDeck));
        for (let i = 0; i < drawnDeck.length; i++){
            current.push(drawnDeck[i]);
        }
        let last = current[current.length - 1];
        console.log("Card played: " + last.rank + last.suit);
        this.send(current.length - 1, current);
    }

    computerTurn() {
        console.log("Computer's turn...");
        console.log("Computer's hand: " + handToString(this.computerHand))
        if (this.checkPlayable(this.computerHand)===true){
            let temp = this.computerHand[0];
            let track = 0;
            for (let i = 0; i < this.computerHand.length; i++){
                if (matchesAnyProperty(this.computerHand[i], this.nextPlay) || this.computerHand[i].rank === "8"){
                    temp = this.computerHand[i];
                    track = i;          
                }}
            console.log("Computer plays "+ temp.rank + temp.suit);
            this.send(track, this.computerHand); // Play the last playable card
            
        } else {
            console.log("Computer has no playble cards for now...");
            this.autoDraw(this.computerHand);
        }
        this.turnIndex = this.turnIndex * (-1);
    }
    
    main(){ 
        while(this.runningStatus === true && this.gameCount < 2){ // Only plays two turns, modify this could run until the game is over
            console.log("This is ongoing game turn #" + (this.gameCount+1) + " ...");
            if(this.playerHand.length === 0 || this.computerHand.length === 0) {
                this.runningStatus = false;
                console.log("This is ongoing game turn #" + (this.gameCount+1) + " ending point...")
            }else{
                clear();
                this.Firstdisplay();
                if (this.turnIndex === 1){
                this.playerTurn();
            } else if (this.turnIndex === -1) {
                this.computerTurn();
                this.gameCount += 1;
            }
                let input;
                let choice = question("Press ENTER to continue...");
                console.log("This is the game turn #" + (this.gameCount) + " ending point...")
            }
        }      
    }
}

new crazyEight(process.argv); // call the main function



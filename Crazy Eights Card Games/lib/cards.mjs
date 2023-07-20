// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function range(start=undefined, end=undefined, inc=undefined) {
    const arr = [];
    if (start !== undefined && end === undefined && inc === undefined){
        for (let i = 0; i < start; i++) {
            arr.push(i);
          }
    }
    else if (start !== undefined && end !== undefined && inc === undefined){
        for (let i = start; i < end; i++) {
            arr.push(i);
          }
    }
    else if (start !== undefined && end !== undefined && inc !== undefined){
        for (let i = start; i < end; i = i + inc) {
            arr.push(i);
          }
    }
    else{return arr;}
    return arr;
}
  
export function generateDeck(){
    let new_deck = new Array();
    for (let i = 0; i < Object.keys(suits).length; i++){
        for (let x = 0; x < ranks.length; x++){
            let card = {suit: suits[Object.keys(suits)[i]], rank: ranks[x]};
            new_deck.push(card);
        }
    }
    return new_deck;
}

// Shuffle Algorithm Reference Page: https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
export function shuffle(decks){
    let newDeck = new Array;
    for (let i = 0; i < decks.length; i++){
        newDeck.push(decks[i]);
    }
    for (let j = 0; j < 9999; j++){
		let choose_random_1st = Math.floor((Math.random() * newDeck.length));
		let choose_random_2nd = Math.floor((Math.random() * newDeck.length));
		let temp = newDeck[choose_random_1st];
		newDeck[choose_random_1st] = newDeck[choose_random_2nd];
		newDeck[choose_random_2nd] = temp;
	}
    return newDeck;
}

export function draw(cardsArray, n = 1){
    let drawnCards = new Array();
    let newCards = new Array();
    for (let j = 0; j < n; j++){
        drawnCards.push(cardsArray[j]);
    }

    for (let i = n; i < cardsArray.length; i++){
        newCards.push(cardsArray[i])
    }
    
    return [newCards, drawnCards];
}

export function deal(cardsArray, numHands=2, cardsPerHand=5){
    let newCardsArray = new Array();
    for (let n = 0; n < cardsArray.length; n++){newCardsArray[n] = cardsArray[n]}
    let hand = new Array();
    for (let i = 0; i < numHands; i++){
        let cards = new Array();
        for (let j = 0; j < cardsPerHand; j++){
            let newCards = newCardsArray.pop();
            cards.push(newCards);
        }
        hand.push(cards);
    }
    let obj1 = {deck: newCardsArray, hands: hand};
    return obj1;
}

export function handToString(current, sep="  ", numbers=false){
    let temp = "";
    if (numbers === false){
        temp += current[0]?.rank + current[0]?.suit;
        for(let i = 1; i < current.length; i++) {
            temp += sep + current[i]?.rank + current[i]?.suit;
        }
    }
    else{
        temp += ('1: ') + current[0]?.rank + current[0]?.suit;
        for(let j = 1; j < current.length; j++) {
            temp += sep + ((j + 1).toString() + ': ')+ current[j].rank + current[j].suit;
        }
    }
    return temp;
}

export function matchesAnyProperty(obj, matchObj){
    for (let i in obj){
        if (obj[i]===matchObj[i]){
            return true
        }
    }
    return false
}

export function drawUntilPlayable(deck, matchObject){
    let newDeck = new Array();
    let drawnCards = new Array();
    for (let l = deck.length - 1; l >= 0; l--) { // indexing is wrong!!!
        if (matchesAnyProperty(deck[l], matchObject) || deck[l].rank === '8' ) {
            drawnCards.push(deck[l]);
            for (let j = 0; j < l; j++) {
                newDeck.push(deck[j]);
            }
            break;
        }
        drawnCards.push(deck[l]);
    }
    return [newDeck, drawnCards];
}

export {
    suits,
    ranks
};
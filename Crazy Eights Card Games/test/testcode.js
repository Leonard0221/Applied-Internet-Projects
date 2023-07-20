// const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
// const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
// const decks = [
//     { suit: '♠️', rank: 'A' },
//     { suit: '♠️', rank: '2' },
//     { suit: '♠️', rank: '3' },
//     { suit: '♠️', rank: '4' },
//     { suit: '♠️', rank: '5' },
//     { suit: '♠️', rank: '6' },
//     { suit: '♠️', rank: '7' },
//     { suit: '♠️', rank: '8' },
//     { suit: '♠️', rank: '9' },
//     { suit: '♠️', rank: '10' },
//     { suit: '♠️', rank: 'J' },
//     { suit: '♠️', rank: 'Q' },
//     { suit: '♠️', rank: 'K' },
//     { suit: '❤️', rank: 'A' },
//     { suit: '❤️', rank: '2' },
//     { suit: '❤️', rank: '3' },
//     { suit: '❤️', rank: '4' },
//     { suit: '❤️', rank: '5' },
//     { suit: '❤️', rank: '6' },
//     { suit: '❤️', rank: '7' },
//     { suit: '❤️', rank: '8' },
//     { suit: '❤️', rank: '9' },
//     { suit: '❤️', rank: '10' },
//     { suit: '❤️', rank: 'J' },
//     { suit: '❤️', rank: 'Q' },
//     { suit: '❤️', rank: 'K' },
//     { suit: '♣️', rank: 'A' },
//     { suit: '♣️', rank: '2' },
//     { suit: '♣️', rank: '3' },
//     { suit: '♣️', rank: '4' },
//     { suit: '♣️', rank: '5' },
//     { suit: '♣️', rank: '6' },
//     { suit: '♣️', rank: '7' },
//     { suit: '♣️', rank: '8' },
//     { suit: '♣️', rank: '9' },
//     { suit: '♣️', rank: '10' },
//     { suit: '♣️', rank: 'J' },
//     { suit: '♣️', rank: 'Q' },
//     { suit: '♣️', rank: 'K' },
//     { suit: '♦️', rank: 'A' },
//     { suit: '♦️', rank: '2' },
//     { suit: '♦️', rank: '3' },
//     { suit: '♦️', rank: '4' },
//     { suit: '♦️', rank: '5' },
//     { suit: '♦️', rank: '6' },
//     { suit: '♦️', rank: '7' },
//     { suit: '♦️', rank: '8' },
//     { suit: '♦️', rank: '9' },
//     { suit: '♦️', rank: '10' },
//     { suit: '♦️', rank: 'J' },
//     { suit: '♦️', rank: 'Q' },
//     { suit: '♦️', rank: 'K' }
//   ]


// function shuffle(decks){
//     for (let i = 0; i < 9999; i++){
// 		let choose_random_1st = Math.floor((Math.random() * decks.length));
// 		let choose_random_2nd = Math.floor((Math.random() * decks.length));
// 		let temp = decks[choose_random_1st];
// 		decks[choose_random_1st] = decks[choose_random_2nd];
// 		decks[choose_random_2nd] = temp;
// 	}
//     return decks;
// }

// function draw(cardsArray, n = 1){
//     const drawnCards = new Array();
//     for (let i = 0; i < n; i++){
//         let removedCard = cardsArray.pop();
//         drawnCards.push(removedCard);
//     }
//     return [cardsArray, drawnCards];
// }

// function deal(cardsArray, numHands = 2, cardsPerHand = 5){
//     let hand = new Array();
//     for (let i = 0; i < numHands; i++){
//         let cards = new Array();
//         for (let j = 0; j < cardsPerHand; j++){
//             let newCards = cardsArray.pop();
//             cards.push(newCards);
//         }
//         hand.push(cards);
//     }
//     let obj1 = {deck: cardsArray, cards: hand};
//     return hand[0];
// }

// function handToString(hand, sep=" ", numbers=false){
//     let temp;
//     if (numbers === false){
//         temp = hand[0].rank + hand[0].suit;
//         for(let i = 1; i < hand.length; i++) {
//             temp += sep + hand[i].rank + hand[i].suit;
//         }
//     }
//     else{
//         temp = ('1: ') + hand[0].rank + hand[0].suit;
//         for(let j = 1; j < hand.length; j++) {
//             temp += sep + ((j + 1).toString() + ': ')+ hand[j].rank + hand[j].suit;
//         }
//     }
//     return temp;
// }

// const tryCards = shuffle(decks);
// CCCCC = deal(tryCards)
// console.log(CCCCC);
// console.log(handToString(CCCCC,"|"));
// function matchesAnyProperty(obj, matchObj){
//     for (let i in obj){
//         if (obj[i]===matchObj[i]){
//             return true
//         }
//     }
//     return false
// }

// const obj = {a: 1, b: 2, c: 3};
// const search = {x: 100, y: 200, b: 2};
// const res1 = matchesAnyProperty(obj, search); // res1 is true
// const res2 = matchesAnyProperty(obj, {a: 90, b: 91}); // res2 is false
// console.log(res1);
// console.log(res2);

// function test(argv){
//     console.log(argv)
// }
// test(process.argv);

const animals = [1,2,3,4,5];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(0, 3));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]

console.log(animals.slice(4));
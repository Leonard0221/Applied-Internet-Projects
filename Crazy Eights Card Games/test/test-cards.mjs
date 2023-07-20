/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import * as cards from '../lib/cards.mjs';
import os from 'os';

const [SPADES, HEARTS, CLUBS, DIAMONDS] = ['♠️', '❤️', '♣️', '♦️'];
const SUITS_ARRAY = [SPADES, HEARTS, CLUBS, DIAMONDS];

// TODO:
// manual testing
// * playing 8 allows choosing of rank or suit
// * computer plays 8, sets
// * computer play after 8
// * player play after 8
// * computer win
// * human win
// * read json to set up decks



describe('cards', () => {
  describe('range', () => {
    it('starts from 0, ends at arg, increments by one when called with single argument', () => {
      const observed = [...cards.range(3)]; // allow both generator and array as return value
      const expected = [0, 1, 2];
      expect(observed).to.deep.equal(expected);
    });
    it('starts from first arg, ends at second arg, increments by one when called with two arguments', () => {
      const observed = [...cards.range(1, 4)]; // allow both generator and array as return value
      const expected = [1, 2, 3];
      expect(observed).to.deep.equal(expected);
    });
    it('starts from first arg, ends at second arg, increments by 3rd arg when called with three arguments', () => {
      const observed = [...cards.range(4, 9, 2)]; // allow both generator and array as return value
      const expected = [4, 6, 8];
      expect(observed).to.deep.equal(expected);
    });
  });

  describe('generateDeck', () => {
    it('has 52 cards', () => {
      const observed = cards.generateDeck().length; 
      const expected = 52;
      expect(observed).to.equal(expected);
    });
    it('has 4 suits, each with 13 ranks', () => {
      const onlySuits = (acc, c) => acc.includes(c.suit) ? acc : [...acc, c.suit];
      const observed = cards.generateDeck().reduce(onlySuits, []);

      const expected = SUITS_ARRAY;
      expect(observed).to.have.all.members(expected);
    });
    it('has 13 ranks, each with 4 suits', () => {
      const onlyFaces = (acc, c) => acc.includes(c.rank) ? acc : [...acc, c.rank];
      const observed = cards.generateDeck().reduce(onlyFaces, []);

      const mapping = {1: 'A', 11: 'J', 12:'Q', 13:'K'};
      const numsToFaces = (num, i) => Object.hasOwn(mapping, i + 1) ? mapping[i + 1] : (i + 1) + '';
      const expected = Array(13).fill(0).map(numsToFaces);
      expect(observed).to.have.all.members(expected);
    });
  });

  describe('shuffle', () => {
    it('has the same cards, but different order', () => {
      const originalDeck = cards.generateDeck();
      const shuffledDeck = cards.shuffle(originalDeck);
      expect(shuffledDeck).to.have.all.members(originalDeck);

      expect(shuffledDeck).to.not.deep.equal(originalDeck);
    });

    it('returns a new deck, but does not modify original deck', () => {
      const originalDeck = cards.generateDeck();
      const beforeShuffle = [...originalDeck];
      cards.shuffle(originalDeck);

      expect(originalDeck).to.deep.equal(beforeShuffle);
    });
  });


  describe('draw', () => {
    it('defaults to one card drawn', () => {
      const numCardsToDraw = 1;
      const originalDeck = cards.generateDeck();
      const [, drawnCards] = cards.draw(originalDeck);

      expect(drawnCards.length).to.equal(numCardsToDraw);
    });

    it('gives new deck with less cards and drawn cards as arrays in an array (with new deck as the first element and cards as second)', () => {
      const numCardsToDraw = 2;
      const originalDeck = cards.generateDeck();
      const [newDeck, drawnCards] = cards.draw(originalDeck, numCardsToDraw);

      expect(newDeck.length).to.equal(originalDeck.length - numCardsToDraw);
      expect(drawnCards.length).to.equal(numCardsToDraw);
    });

    it('gives back card(s) that were originally in the deck, with those cards no longer appearing in new deck', () => {
      const numCardsToDraw = 2;
      const originalDeck = cards.generateDeck();
      const [newDeck, drawnCards] = cards.draw(originalDeck, numCardsToDraw);

      expect(originalDeck).to.include(drawnCards[0]);
      expect(originalDeck).to.include(drawnCards[1]);

      expect(newDeck).to.not.include(drawnCards[0]);
      expect(newDeck).to.not.include(drawnCards[1]);
    });

    it('does not modify original deck passed in; gives back new deck', () => {
      const originalDeck = cards.generateDeck();
      const beforeDraw = [...originalDeck];
      cards.draw(originalDeck);

      expect(originalDeck).to.deep.equal(beforeDraw);
    });
  });

  describe('deal', () => {
    it('defaults to two hands, each with five cards', () => {
      const numHands = 2;
      const cardsPerHand = 5;
      const originalDeck = cards.generateDeck();
      const {hands} = cards.deal(originalDeck);
      const [hand1, hand2] = hands;

      expect(hands.length).to.equal(numHands);
      expect(hand1.length).to.equal(cardsPerHand);
      expect(hand2.length).to.equal(cardsPerHand);
    });

    it('gives back specified hands and new deck with less cards', () => {
      const numHands = 3;
      const cardsPerHand = 7;
      const originalDeck = cards.generateDeck();
      const {deck, hands} = cards.deal(originalDeck, numHands, cardsPerHand);
      const [hand1, hand2, hand3] = hands;

      expect(hands.length).to.equal(numHands);
      expect(hand1.length).to.equal(cardsPerHand);
      expect(hand2.length).to.equal(cardsPerHand);
      expect(hand3.length).to.equal(cardsPerHand);
      expect(deck.length).to.equal(originalDeck.length - (numHands * cardsPerHand));
    });

    it('does not modify original deck passed in; gives back new deck', () => {
      const originalDeck = cards.generateDeck();
      const beforeDeal = [...originalDeck];
      cards.deal(originalDeck);

      expect(originalDeck).to.deep.equal(beforeDeal);
    });
  });

  /*
  describe('getMost', () => {
    // NOTE: behavior for ties is not specified; ties can be handled at your discretion
    it('returns an object with a key of rank and the rank value that occurs most in hand out of all rank and suit values', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const observed = cards.getMost(hand);
      const expected = {suit: HEARTS};
      expect(observed).to.deep.equal(expected);
    });

    it('returns an object with a key of suit and the suit value that occurs most in hand out of all rank and suit values', () => {
      const hand = [
        {suit: SPADES, rank: 'J'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: CLUBS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: '5'}
      ];

      const observed = cards.getMost(hand);
      const expected = {rank: 'J'};
      expect(observed).to.deep.equal(expected);
    });
  });
  */

  describe('handToString', () => {
    it('displays an array of cards as double-space separated rank and suit strings (no space between rank and suit) by default', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const observed = cards.handToString(hand);
      const expected = `3${SPADES}  2${HEARTS}  J${HEARTS}  J${DIAMONDS}  Q${HEARTS}`;
      expect(observed).to.equal(expected);
    });

    it('gives back only a rank and suit if there is a single card in the hand', () => {
      const hand = [{suit: SPADES, rank: '3'}];

      const observed = cards.handToString(hand);
      const expected = `3${SPADES}`;
      expect(observed).to.equal(expected);
    });

    it('can take a separator as an argument to replace the spaces (for example, newline would format the string as a vertical column)', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const observed = cards.handToString(hand, os.EOL);
      const expected = `3${SPADES}${os.EOL}2${HEARTS}${os.EOL}J${HEARTS}${os.EOL}J${DIAMONDS}${os.EOL}Q${HEARTS}`;
      expect(observed).to.equal(expected);
    });

    it('can prefix each card with the position number (starting at 1) and a colon and a space (for example 1: ) by passing in true for the last parameter', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const observed = cards.handToString(hand, '  ', true);
      const expected = `1: 3${SPADES}  2: 2${HEARTS}  3: J${HEARTS}  4: J${DIAMONDS}  5: Q${HEARTS}`;
      expect(observed).to.equal(expected);
    });

    it('can prefix each card with the position number and modify the separators (in this example, a vertical column, with each card prefixed by a number)', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const observed = cards.handToString(hand, os.EOL, true);
      const expected = `1: 3${SPADES}${os.EOL}2: 2${HEARTS}${os.EOL}3: J${HEARTS}${os.EOL}4: J${DIAMONDS}${os.EOL}5: Q${HEARTS}`;
      expect(observed).to.equal(expected);
    });
  });

  
  /*
  describe('findCard', () => {
    it('returns a card and index of card if the card matches ANY of the keys in the search criteria', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const [observedIndex, observedCard] = cards.findCard(hand, {rank: '10', suit: HEARTS});
      const expectedIndex = 1;
      const expectedCard = {suit: HEARTS, rank: '2'};
      expect(observedIndex).to.deep.equal(expectedIndex);
      expect(observedCard).to.deep.equal(expectedCard);
    });

    it('returns any card object and index of card from array that has a matching key and value from the search criteria provided', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      let [observedIndex, observedCard] = cards.findCard(hand, {suit: DIAMONDS});
      let expectedIndex = 3;
      let expectedCard = {suit: DIAMONDS, rank: 'J'};
      expect(observedIndex).to.deep.equal(expectedIndex);
      expect(observedCard).to.deep.equal(expectedCard);

      [observedIndex, observedCard] = cards.findCard(hand, {rank: '3'});
      expectedIndex = 0;
      expectedCard = {suit: SPADES, rank: '3'};
      expect(observedIndex).to.deep.equal(expectedIndex);
      expect(observedCard).to.deep.equal(expectedCard);

      [observedIndex, observedCard] = cards.findCard(hand, {rank: 'Q'});
      expectedIndex = 4;
      expectedCard = {suit: HEARTS, rank: 'Q'};
      expect(observedIndex).to.deep.equal(expectedIndex);
      expect(observedCard).to.deep.equal(expectedCard);
    });

    it('returns the first matching result, starting from the beginning of card array', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      const [observedIndex, observedCard] = cards.findCard(hand, {suit: HEARTS});
      const expectedIndex = 1;
      const expectedCard = {suit: HEARTS, rank: '2'};
      expect(observedIndex).to.deep.equal(expectedIndex);
      expect(observedCard).to.deep.equal(expectedCard);
    });

    it('returns null if card is not found', () => {
      const hand = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      ];

      let observed = cards.findCard(hand, {suit: CLUBS});
      expect(observed).to.be.null;

      observed = cards.findCard(hand, {rank: '10'});
      expect(observed).to.be.null;
    });
  });
  */

  describe('matchesAnyProperty', () => {
    it('returns true if any prop and value pair in obj matches any prop and value pair in matchObj (in this case, matches suit)', () => {
      const matchObj = {suit: SPADES, rank: '3'};
      expect(cards.matchesAnyProperty({suit: SPADES, rank: 'A'}, matchObj)).to.be.true;
    });

    it('returns true if any prop and value pair in obj matches any prop and value pair in matchObj (in this case, matches rank)', () => {
      const matchObj = {suit: SPADES, rank: '3'};
      expect(cards.matchesAnyProperty({suit: HEARTS, rank: '3'}, matchObj)).to.be.true;
    });

    it('returns false if no prop and value pairs in obj matches any prop and value pairs in matchObj', () => {
      const matchObj = {suit: SPADES, rank: '3'};
      expect(cards.matchesAnyProperty({suit: HEARTS, rank: 'A'}, matchObj)).to.be.false;
    });
  });

  describe('drawUntilPlayable', () => {
    it('draws card from deck until an 8... or rank or suit is matched (in this case, match suit)', () => {
      const matchObj = {suit: HEARTS, rank: '9'};

      const deck = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: 'Q'} 
      ];

      const observed = cards.drawUntilPlayable(deck, matchObj);
      const expectedDeck = [{suit: SPADES, rank: '3'}]; 
      const expectedCardsDrawn = [
        {suit: CLUBS, rank: 'Q'},
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'J'} 
      ];
      const [observedDeck, observedCardsDrawn] = observed;

      expect(observedDeck).to.have.deep.members(expectedDeck);
      expect(observedCardsDrawn).to.have.deep.members(expectedCardsDrawn);
    });

    it('draws card from deck until an 8... or a rank or suit is matched (in this case, match suit), the last card drawn (end of array) is the match', () => {
      const matchObj = {suit: HEARTS, rank: '9'};

      const deck = [
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: 'Q'} 
      ];

      const observed = cards.drawUntilPlayable(deck, matchObj);
      const expectedDeck = [{suit: SPADES, rank: '3'}]; 
      const expectedCardsDrawn = [
        {suit: CLUBS, rank: 'Q'},
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'J'} 
      ];
      const [observedDeck, observedCardsDrawn] = observed;

      expect(observedDeck).to.have.deep.members(expectedDeck);
      expect(observedCardsDrawn).to.have.deep.members(expectedCardsDrawn);
      expect(observedCardsDrawn[observedCardsDrawn.length - 1]).to.deep.equal({suit: HEARTS, rank: 'J'});

    });

    it('draws card from deck until an 8... or a rank or suit is matched (in this case, match rank)', () => {
      const matchObj = {suit: HEARTS, rank: '9'};

      const deck = [
        {suit: SPADES, rank: '3'}, 
        {suit: SPADES, rank: '9'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: 'Q'} 
      ];

      const observed = cards.drawUntilPlayable(deck, matchObj);
      const expectedDeck = [{suit: SPADES, rank: '3'}]; 
      const expectedCardsDrawn = [
        {suit: CLUBS, rank: 'Q'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: SPADES, rank: '9'} 
      ];
      const [observedDeck, observedCardsDrawn] = observed;

      expect(observedDeck).to.have.deep.members(expectedDeck);
      expect(observedCardsDrawn).to.have.deep.members(expectedCardsDrawn);
    });

    it('draws card from deck until an 8.... or a rank or suit is matched (in this case, match 8)', () => {
      const matchObj = {suit: HEARTS, rank: '9'};

      const deck = [
        {suit: SPADES, rank: '1'}, 
        {suit: SPADES, rank: '2'}, 
        {suit: DIAMONDS, rank: '8'},
        {suit: CLUBS, rank: '4'}
      ];

      const observed = cards.drawUntilPlayable(deck, matchObj);
      const expectedDeck = [{suit: SPADES, rank: '1'}, {suit: SPADES, rank: '2'}]; 
      const expectedCardsDrawn = [
        {suit: CLUBS, rank: '4'}, 
        {suit: DIAMONDS, rank: '8'},
      ];
      const [observedDeck, observedCardsDrawn] = observed;

      expect(observedDeck).to.have.deep.members(expectedDeck);
      expect(observedCardsDrawn).to.have.deep.members(expectedCardsDrawn);
    });

    
    it('draws all cards from deck (leaves deck empty) if no 8, rank, or suit is matched', () => {
      const matchObj = {suit: HEARTS, rank: '9'};

      const deck = [
        {suit: SPADES, rank: '3'}, 
        {suit: CLUBS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: 'Q'} 
      ];

      const observed = cards.drawUntilPlayable(deck, matchObj);
      const expectedDeck = []; 
      const expectedCardsDrawn = [
        {suit: CLUBS, rank: 'Q'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: CLUBS, rank: 'J'}, 
        {suit: SPADES, rank: '3'} 
      ];

      const [observedDeck, observedCardsDrawn] = observed;

      expect(observedDeck).to.have.deep.members(expectedDeck);
      expect(observedCardsDrawn).to.have.deep.members(expectedCardsDrawn);
    });
  });

  /*
  describe('autoplay', () => {
    // [deck, playerHand, computerHand, discard]
    // [deck, playerHand, computerHand, discard]
    it('plays through', () => {
      const deck = {
        {suit: SPADES, rank: '3'}, 
        {suit: HEARTS, rank: '2'}, 
        {suit: HEARTS, rank: 'J'}, 
        {suit: DIAMONDS, rank: 'J'},
        {suit: HEARTS, rank: 'Q'} 
      }
      const discard = [{suit: HEARTS, rank: '5'}];
      const computerHand = [
        {suit: CLUBS, rank: '7'}, 
        {suit: HEARTS, rank: '8'},
      ];
      const playerHand = [
        {suit: HEARTS, rank: '2'}, 
        {suit: DIAMONDS, rank: 'K'},
      ];

    });
    const gameState = autoplay(deck, playerHand, computerHand, discard, moves);
    const expected = [
      [
      ],
      [
      ],
      [
      ],
      [
      ],
    ];

    expect(gameState).to.deep.equal([]);
  });
  */
});


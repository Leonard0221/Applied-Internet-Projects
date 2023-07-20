import mongoose from 'mongoose';

const game = new mongoose.Schema({
    userName: {type: String, required: true},
    botScore: {type: Number, required: true},
    userScore: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

const Game = mongoose.model('Game', game);

export default Game;
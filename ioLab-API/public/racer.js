import { io } from '/socket.io/socket.io.esm.min.js';
const socket = io();

const player1Btn = document.querySelector('.player1Btn');
const player2Btn = document.querySelector('.player2Btn');
const player1 = document.querySelector('.player1');
const player2 = document.querySelector('.player2');
const playArea = document.querySelector('.play-area');
const finishLine = playArea.offsetWidth - player1.offsetWidth;

// when someone connects, show the current position of both emojis
socket.on('connect', () => {
  socket.emit('get current position');
});

// when the current position is received, move the emojis to those positions
socket.on('current position', (positions) => {
  player1.style.left = `${positions[0]}px`;
  player2.style.left = `${positions[1]}px`;
});

// when a player clicks a button, emit a "move" event with the player number (1 or 2)
player1Btn.addEventListener('click', () => {
  socket.emit('move', 1);
});

player2Btn.addEventListener('click', () => {
  socket.emit('move', 2);
});

// when a "move" event is received, move the appropriate emoji
socket.on('move', (player, position) => {
  if (player === 1) {
    player1.style.left = `${position}px`;
  } else if (player === 2) {
    player2.style.left = `${position}px`;
  }
});

// when a player crosses the finish line, emit a "winner" event
function checkForWinner() {
  if (player1.offsetLeft >= finishLine) {
    socket.emit('winner', 1);
  } else if (player2.offsetLeft >= finishLine) {
    socket.emit('winner', 2);
  }
}

// listen for the "winner" event and display a message on all screens
socket.on('winner', (player) => {
  alert(`Player ${player} wins!`);
});

// update the position of the emoji when the window is resized
window.addEventListener('resize', () => {
  finishLine = playArea.offsetWidth - player1.offsetWidth;
  socket.emit('get current position');
});

// listen for the "disconnect" event and log it to the console
socket.on('disconnect', () => {
  console.log('disconnected');
});

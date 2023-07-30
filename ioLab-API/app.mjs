import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, 'public')));

const players = {
  1: 0,
  2: 0,
};

io.on('connection', (socket) => {
  console.log('a user connected');

  // when a player moves, emit a "move" event with the player number and position
  socket.on('move', (player) => {
    players[player] += 10;
    io.emit('move', player, players[player]);
    checkForWinner();
  });

  // when a player disconnects, log it to the console
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // when a new player connects, emit the current positions of both emojis
  // socket.on('get current position', () => {
  //   socket.emit('current position', [players[1], players[2]]);
  // });
  socket.emit('current position', [players[1], players[2]]);


  // when a player wins, emit a "winner" event
  function checkForWinner() {
    if (players[1] >= 1000) {
      io.emit('winner', 1);
    } else if (players[2] >= 1000) {
      io.emit('winner', 2);
    }
  }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

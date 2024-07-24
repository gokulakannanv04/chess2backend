const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getValidMoves, startTurn, switchTurn } = require('./getValidMoves');
const { Console } = require('console');


const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://sampledb:sampledb@cluster0.vusts07.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const User = mongoose.model('User', {
  username: String,
  password: String,
  Registerdate: {
    type: Date,
    required: true,
    default: Date.now,
    set: function (value) {
      const utcDate = new Date(value);
      utcDate.setHours(utcDate.getHours() + 6, utcDate.getMinutes() - 30);
      return utcDate;
    }
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already registered' });
    }

    const encrypted = AES.encrypt(password, 'secret-key').toString();
    const user = new User({ username, password: encrypted });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      const decrypted = AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
      const passwordMatch = decrypted === password;

      if (passwordMatch) {
        const { _id, username, password } = user;
        res.status(200).json({ message: 'Login successful', _id, username, password });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
        console.log(user.password);
      }
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const gameRooms = [];


wss.on('connection', (ws) => {
  console.log('New client connected');
  let player;
  let gameRoom;

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'initializeGame') {
      player = {
        ws: ws,
        gameId: generateGameId(),
        gameRoomId: null,
        color: null
      };

      gameRoom = findAvailableGameRoom();
      if (!gameRoom) {
        gameRoom = createGameRoom(player.gameId);
        gameRooms.push(gameRoom);
      }

      addPlayerToGameRoom(player, gameRoom);

      if (gameRoom.players.length === 2) {
        gameRoom.players.forEach(player => {
          player.ws.send(JSON.stringify({ type: 'ready' }));
        });
        initializeGame(gameRoom);
        startTurn();
      } else {
        player.ws.send(JSON.stringify({ type: 'waitingForPlayer' }));
      }
    } else if (data.type === 'getValidMoves') {
      handleGetValidMoves(ws, data, gameRoom.players);
    } else if (data.type === 'move') {
      switchTurn();
      handleMove(ws, data, player.gameRoomId);
    } else if (data.type === 'promotionUpdate') {
      promotionPiece(ws,data,gameRoom.players);
      // console.log(ws, data, gameRoom.players);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (player && player.gameRoomId) {
      const gameRoom = gameRooms.find(room => room.id === player.gameRoomId);

      if (gameRoom) {
        let remainingPlayer;
        if (gameRoom.players[0].gameId === player.gameId) {
          remainingPlayer = gameRoom.players[1];
        } else {
          remainingPlayer = gameRoom.players[0];
        }

        if (remainingPlayer) {
          remainingPlayer.ws.send(JSON.stringify({ type: 'gameOver', winner: 'Win' }));
        }

        removePlayerFromGameRoom(player);
        gameRooms.splice(gameRooms.indexOf(gameRoom), 1);
      } else {
        console.log('Game room not found.');
      }
    }
  });
});

function generateGameId() {
  return Math.random().toString(36).substring(7);
}

function handleGetValidMoves(ws, data, players) {
  const { row, col, color, piece } = data;
  const currentPlayerColor = players.find(player => player.ws === ws).color;
  const validMoves = getValidMoves(piece, row, col, color, data.board, currentPlayerColor);

  ws.send(JSON.stringify({ type: 'validMoves', moves: validMoves }));
}

function promotionPiece(ws,data, players) {
  const { board, color, piece,gameRoom } = data;
console.log(board);
  if (color === 'b') {
      for (let col = 0; col < 8; col++) {
          const currentPiece = board[7][col];
          if (currentPiece === 'bpawn') {
              board[7][col] = piece;
          }
      }
  } else {
      for (let col = 0; col < 8; col++) {
          const currentPiece = board[0][col];
          if (currentPiece === 'wpawn') {
              board[0][col] = piece;
          }
      }
  }
players.forEach(player => {
    player.ws.send(JSON.stringify({ type: 'updateBoard', board: data.board }));
  });

}

function handleMove(ws, data, gameRoomId) {
  const gameRoom = gameRooms.find(room => room.id === gameRoomId);

  if (!gameRoom) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
    return;
  }

  const { from, to, color } = data;
  const isValidMove = validateMove(from, to, color, data.board);

  if (isValidMove) {
    updateBoard(from, to, data.board);
    checkGameOver(data.board, gameRoom,ws);

    gameRoom.players.forEach(player => {
      player.ws.send(JSON.stringify({ type: 'updateBoard', board: data.board }));
    });
  } else {
    ws.send(JSON.stringify({ type: 'invalidMove' }));
  }
}

function findAvailableGameRoom() {
  for (const room of gameRooms) {
    if (room.players.length < 2) {
      return room;
    }
  }
  return null;
}

function createGameRoom(gameId) {
  return {
    id: gameId,
    players: []
  };
}

function removePlayerFromGameRoom(player) {
  const gameRoom = gameRooms.find(room => room.id === player.gameRoomId);
  if (gameRoom) {
    gameRoom.players = gameRoom.players.filter(p => p !== player);
    player.gameRoomId = null;
  }
}

function addPlayerToGameRoom(player, gameRoom) {
  gameRoom.players.push(player);
  player.gameRoomId = gameRoom.id;
  player.color = gameRoom.players.length === 1 ? 'w' : 'b';
  console.log(gameRoom);
  console.log(gameRoom.players.length);
}

function initializeGame(gameRoom) {
  if (gameRoom && gameRoom.players.length === 2) {
    gameRoom.players.forEach(player => {
      player.ws.send(JSON.stringify({ type: 'initializeGame', gameId: gameRoom.id }));
    });
  } else {
    console.error("Invalid game room or players array.");
  }
}

function validateMove(from, to, color, board) {
  // Add your validation logic here
  // Example: Check if the move is valid based on the current board state
  return true; // Replace true with your actual validation logic
}

function updateBoard(from, to, board) {
  // Add your board update logic here
}



function checkGameOver(board, gameRoom,ws) {
  let whiteKingPresent = false;
  let blackKingPresent = false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      
      if (piece === 'wking') {
        whiteKingPresent = true;
      } else if (piece === 'bking') {
        blackKingPresent = true;
      }
    }
  }
  if(blackKingPresent&&whiteKingPresent){
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if((row==0)&&piece==='wpawn'){
        console.log("whitepawn");
        // board[row][col]='wqueen';
        gameRoom.players[0].ws.send(JSON.stringify({ type: 'pawnPromotion',gameRoom,ws}));
       
      }
      if((row==7)&&piece==='bpawn'){
        console.log("blackpawn");
        gameRoom.players[1].ws.send(JSON.stringify({ type: 'pawnPromotion',gameRoom,ws}));
      }}}}
  if (!whiteKingPresent) {
    gameRoom.players[0].ws.send(JSON.stringify({ type: 'gameOver', winner: "Loss" }));
    gameRoom.players[1].ws.send(JSON.stringify({ type: 'gameOver', winner: "Win" }));
  } else if (!blackKingPresent) {
    gameRoom.players[0].ws.send(JSON.stringify({ type: 'gameOver', winner: "Win" }));
    gameRoom.players[1].ws.send(JSON.stringify({ type: 'gameOver', winner: "Loss" }));
  }
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
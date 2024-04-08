let currentTurn = 'white'; // Initialize the current turn to white

const switchTurn = () => {
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
};

const getValidMoves = (piece, row, col, color, board,currentPlayerColor) => {
  const validMoves = [];

  // Define a function to check if a position is within the bounds of the board
  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  // Calculate valid moves based on piece type
  switch (piece) {
    case 'bpawn':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black pawn logic...
        // Black pawn moves forward by one square if the destination is empty
        if (isValidPosition(row + 1, col) && board[row + 1][col] === 'Empty') {
          validMoves.push({ row: row + 1, col });
        }
        // Black pawn moves forward by two squares from the starting position if both squares are empty
        if (row === 1 && board[2][col] === 'Empty' && board[3][col] === 'Empty') {
          validMoves.push({ row: 3, col });
        }
        // Black pawn captures diagonally
        if (isValidPosition(row + 1, col - 1) && board[row + 1][col - 1].charAt(0) === 'w') {
          validMoves.push({ row: row + 1, col: col - 1 });
        }
        if (isValidPosition(row + 1, col + 1) && board[row + 1][col + 1].charAt(0) === 'w') {
          validMoves.push({ row: row + 1, col: col + 1 });
        }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wpawn':

      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White pawn logic...
        if (isValidPosition(row - 1, col) && board[row - 1][col] === 'Empty') {
          validMoves.push({ row: row - 1, col });
        }
        // White pawn moves forward by two squares from the starting position if both squares are empty
        if (row === 6 && board[5][col] === 'Empty' && board[4][col] === 'Empty') {
          validMoves.push({ row: 4, col });
        }
        // White pawn captures diagonally
        if (isValidPosition(row - 1, col - 1) && board[row - 1][col - 1].charAt(0) === 'b') {
          validMoves.push({ row: row - 1, col: col - 1 });
        }
        if (isValidPosition(row - 1, col + 1) && board[row - 1][col + 1].charAt(0) === 'b') {
          validMoves.push({ row: row - 1, col: col + 1 });
        }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wrook':
      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White rook logic...
        for (let r = row + 1; r < 8; r++) {
          if (board[r][col] === 'Empty') {
            validMoves.push({ row: r, col });
          } else if (board[r][col].charAt(0) !== color) {
            validMoves.push({ row: r, col });
            break;
          } else {
            break;
          }
        }
        // Check vertically upwards
        for (let r = row - 1; r >= 0; r--) {
          if (board[r][col] === 'Empty') {
            validMoves.push({ row: r, col });
          } else if (board[r][col].charAt(0) !== color) {
            validMoves.push({ row: r, col });
            break;
          } else {
            break;
          }
        }
        // Check horizontally to the right
        for (let c = col + 1; c < 8; c++) {
          if (board[row][c] === 'Empty') {
            validMoves.push({ row, col: c });
          } else if (board[row][c].charAt(0) !== color) {
            validMoves.push({ row, col: c });
            break;
          } else {
            break;
          }
        }
        // Check horizontally to the left
        for (let c = col - 1; c >= 0; c--) {
          if (board[row][c] === 'Empty') {
            validMoves.push({ row, col: c });
          } else if (board[row][c].charAt(0) !== color) {
            validMoves.push({ row, col: c });
            break;
          }
          else {
            break;
          }
        }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'brook':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black rook logic...
        for (let r = row + 1; r < 8; r++) {
          if (board[r][col] === 'Empty') {
            validMoves.push({ row: r, col });
          } else if (board[r][col].charAt(0) !== color) {
            validMoves.push({ row: r, col });
            break;
          } else {
            break;
          }
        }
        // Check vertically upwards
        for (let r = row - 1; r >= 0; r--) {
          if (board[r][col] === 'Empty') {
            validMoves.push({ row: r, col });
          } else if (board[r][col].charAt(0) !== color) {
            validMoves.push({ row: r, col });
            break;
          } else {
            break;
          }
        }
        // Check horizontally to the right
        for (let c = col + 1; c < 8; c++) {
          if (board[row][c] === 'Empty') {
            validMoves.push({ row, col: c });
          } else if (board[row][c].charAt(0) !== color) {
            validMoves.push({ row, col: c });
            break;
          } else {
            break;
          }
        }
        // Check horizontally to the left
        for (let c = col - 1; c >= 0; c--) {
          if (board[row][c] === 'Empty') {
            validMoves.push({ row, col: c });
          } else if (board[row][c].charAt(0) !== color) {
            validMoves.push({ row, col: c });
            break;
          }
          else {
            break;
          }
        }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wknight':
      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White knight logic...
        const WknightMoves = [
          { row: row - 2, col: col - 1 },
          { row: row - 2, col: col + 1 },
          { row: row - 1, col: col - 2 },
          { row: row - 1, col: col + 2 },
          { row: row + 1, col: col - 2 },
          { row: row + 1, col: col + 2 },
          { row: row + 2, col: col - 1 },
          { row: row + 2, col: col + 1 },
        ];
        WknightMoves.forEach(move => {
          if (isValidPosition(move.row, move.col) && (board[move.row][move.col] === 'Empty' || board[move.row][move.col].charAt(0) !== color)) {
            validMoves.push(move);
          }
        });
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'bknight':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black knight logic...
        const knightMoves = [
          { row: row - 2, col: col - 1 },
          { row: row - 2, col: col + 1 },
          { row: row - 1, col: col - 2 },
          { row: row - 1, col: col + 2 },
          { row: row + 1, col: col - 2 },
          { row: row + 1, col: col + 2 },
          { row: row + 2, col: col - 1 },
          { row: row + 2, col: col + 1 },
        ];
        knightMoves.forEach(move => {
          if (isValidPosition(move.row, move.col) && (board[move.row][move.col] === 'Empty' || board[move.row][move.col].charAt(0) !== color)) {
            validMoves.push(move);
          }
        });
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wbishop':
      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White bishop logic...
        let i = row - 1, j = col - 1;
        while (isValidPosition(i, j) && (board[i][j] === 'Empty' || board[i][j].charAt(0) !== color)) {
          validMoves.push({ row: i, col: j });
          if (board[i][j] !== 'Empty' && board[i][j].charAt(0) !== color) {
            break;
          }
          i--;
          j--;
        }
        // Check diagonally to the top right
        i = row - 1;
        j = col + 1;
        while (isValidPosition(i, j) && (board[i][j] === 'Empty' || board[i][j].charAt(0) !== color)) {
          validMoves.push({ row: i, col: j });
          if (board[i][j] !== 'Empty' && board[i][j].charAt(0) !== color) {
            break;
          }
          i--;
          j++;
        }
        // Check diagonally to the bottom left
        i = row + 1;
        j = col - 1;
        while (isValidPosition(i, j) && (board[i][j] === 'Empty' || board[i][j].charAt(0) !== color)) {
          validMoves.push({ row: i, col: j });
          if (board[i][j] !== 'Empty' && board[i][j].charAt(0) !== color) {
            break;
          }
          i++;
          j--;
        }
        // Check diagonally to the bottom right
        i = row + 1;
        j = col + 1;
        while (isValidPosition(i, j) && (board[i][j] === 'Empty' || board[i][j].charAt(0) !== color)) {
          validMoves.push({ row: i, col: j });
          if (board[i][j] !== 'Empty' && board[i][j].charAt(0) !== color) {
            break;
          }
          i++;
          j++;
        }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'bbishop':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black bishop logic...
        let o = row - 1, p = col - 1;
while (isValidPosition(o, p) && (board[o][p] === 'Empty' || board[o][p].charAt(0) !== color)) {
    validMoves.push({ row: o, col: p });
    if (board[o][p] !== 'Empty' && board[o][p].charAt(0) !== color) {
        break;
    }
    o--;
    p--;
}
// Check diagonally to the top right
o = row - 1;
p = col + 1;
while (isValidPosition(o, p) && (board[o][p] === 'Empty' || board[o][p].charAt(0) !== color)) {
    validMoves.push({ row: o, col: p });
    if (board[o][p] !== 'Empty' && board[o][p].charAt(0) !== color) {
        break;
    }
    o--;
    p++;
}
// Check diagonally to the bottom left
o = row + 1;
p = col - 1;
while (isValidPosition(o, p) && (board[o][p] === 'Empty' || board[o][p].charAt(0) !== color)) {
    validMoves.push({ row: o, col: p });
    if (board[o][p] !== 'Empty' && board[o][p].charAt(0) !== color) {
        break;
    }
    o++;
    p--;
}
// Check diagonally to the bottom right
o = row + 1;
p = col + 1;
while (isValidPosition(o, p) && (board[o][p] === 'Empty' || board[o][p].charAt(0) !== color)) {
    validMoves.push({ row: o, col: p });
    if (board[o][p] !== 'Empty' && board[o][p].charAt(0) !== color) {
        break;
    }
    o++;
    p++;
}
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wqueen':
      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White queen logic...
        for (let k = row - 1; k >= 0; k--) {
          if (board[k][col] === 'Empty' || board[k][col].charAt(0) !== color) {
            validMoves.push({ row: k, col });
            if (board[k][col] !== 'Empty') {
              break;
            }
          } else {
            break;
          }
        }
        for (let k = row + 1; k < 8; k++) {
          if (board[k][col] === 'Empty' || board[k][col].charAt(0) !== color) {
            validMoves.push({ row: k, col });
            if (board[k][col] !== 'Empty') {
              break;
            }
          } else {
            break;
          }
        }
        for (let l = col - 1; l >= 0; l--) {
          if (board[row][l] === 'Empty' || board[row][l].charAt(0) !== color) {
            validMoves.push({ row, col: l });
            if (board[row][l] !== 'Empty') {
              break;
            }
          } else {
            break;
          }
        }
        for (let l = col + 1; l < 8; l++) {
          if (board[row][l] === 'Empty' || board[row][l].charAt(0) !== color) {
            validMoves.push({ row, col: l });
            if (board[row][l] !== 'Empty') {
              break;
            }
          } else {
            break;
          }
        }
        // Add logic for diagonal movement (bishop-like)
        // Check diagonally to the top left
        let k = row - 1, l = col - 1;
        while (isValidPosition(k, l) && (board[k][l] === 'Empty' || board[k][l].charAt(0) !== color)) {
          validMoves.push({ row: k, col: l });
          if (board[k][l] !== 'Empty' && board[k][l].charAt(0) !== color) {
            break;
          }
          k--;
          l--;
        }
        // Check diagonally to the top right
        k = row - 1;
        l = col + 1;
        while (isValidPosition(k, l) && (board[k][l] === 'Empty' || board[k][l].charAt(0) !== color)) {
          validMoves.push({ row: k, col: l });
          if (board[k][l] !== 'Empty' && board[k][l].charAt(0) !== color) {
            break;
          }
          k--;
          l++;
        }
        // Check diagonally to the bottom left
        k = row + 1;
        l = col - 1;
        while (isValidPosition(k, l) && (board[k][l] === 'Empty' || board[k][l].charAt(0) !== color)) {
          validMoves.push({ row: k, col: l });
          if (board[k][l] !== 'Empty' && board[k][l].charAt(0) !== color) {
            break;
          }
          k++;
          l--;
        }
        // Check diagonally to the bottom right
        k = row + 1;
        l = col + 1;
        while (isValidPosition(k, l) && (board[k][l] === 'Empty' || board[k][l].charAt(0) !== color)) {
          validMoves.push({ row: k, col: l });
          if (board[k][l] !== 'Empty' && board[k][l].charAt(0) !== color) {
            break;
          }
          k++;
          l++;
        }
    
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'bqueen':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black queen logic...
        for (let m = row - 1; m >= 0; m--) {
          if (board[m][col] === 'Empty' || board[m][col].charAt(0) !== color) {
              validMoves.push({ row: m, col });
              if (board[m][col] !== 'Empty') {
                  break;
              }
          } else {
              break;
          }
      }
      for (let m = row + 1; m < 8; m++) {
          if (board[m][col] === 'Empty' || board[m][col].charAt(0) !== color) {
              validMoves.push({ row: m, col });
              if (board[m][col] !== 'Empty') {
                  break;
              }
          } else {
              break;
          }
      }
      for (let n = col - 1; n >= 0; n--) {
          if (board[row][n] === 'Empty' || board[row][n].charAt(0) !== color) {
              validMoves.push({ row, col: n });
              if (board[row][n] !== 'Empty') {
                  break;
              }
          } else {
              break;
          }
      }
      for (let n = col + 1; n < 8; n++) {
          if (board[row][n] === 'Empty' || board[row][n].charAt(0) !== color) {
              validMoves.push({ row, col: n });
              if (board[row][n] !== 'Empty') {
                  break;
              }
          } else {
              break;
          }
      }
      // Add logic for diagonal movement (bishop-like)
      // Check diagonally to the top left
      let n = row - 1, m = col - 1;
      while (isValidPosition(n, m) && (board[n][m] === 'Empty' || board[n][m].charAt(0) !== color)) {
          validMoves.push({ row: n, col: m });
          if (board[n][m] !== 'Empty' && board[n][m].charAt(0) !== color) {
              break;
          }
          n--;
          m--;
      }
      // Check diagonally to the top right
      n = row - 1;
      m = col + 1;
      while (isValidPosition(n, m) && (board[n][m] === 'Empty' || board[n][m].charAt(0) !== color)) {
          validMoves.push({ row: n, col: m });
          if (board[n][m] !== 'Empty' && board[n][m].charAt(0) !== color) {
              break;
          }
          n--;
          m++;
      }
      // Check diagonally to the bottom left
      n = row + 1;
      m = col - 1;
      while (isValidPosition(n, m) && (board[n][m] === 'Empty' || board[n][m].charAt(0) !== color)) {
          validMoves.push({ row: n, col: m });
          if (board[n][m] !== 'Empty' && board[n][m].charAt(0) !== color) {
              break;
          }
          n++;
          m--;
      }
      // Check diagonally to the bottom right
      n = row + 1;
      m = col + 1;
      while (isValidPosition(n, m) && (board[n][m] === 'Empty' || board[n][m].charAt(0) !== color))
      {
          validMoves.push({ row: n, col: m });
          if (board[n][m] !== 'Empty' && board[n][m].charAt(0) !== color) {
              break;
          }
          n++;
          m++;
      }
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'wking':
      if (color === 'w' && currentTurn === 'white'&&currentPlayerColor==='w') {
        // White king logic...
     
          const directions = [
            { row: -1, col: -1 },
            { row: -1, col: 0 },
            { row: -1, col: 1 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
            { row: 1, col: -1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
          ];
          directions.forEach(direction => {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
            if (isValidPosition(newRow, newCol) && (board[newRow][newCol] === 'Empty' || board[newRow][newCol].charAt(0) !== color)) {
              validMoves.push({ row: newRow, col: newCol });
            }
          });
        switchTurn(); // Switch turn after a valid move
      }
      break;
    case 'bking':
      if (color === 'b' && currentTurn === 'black' &&currentPlayerColor==='b') {
        // Black king logic...
        const bdirections = [
          { row: -1, col: -1 },
          { row: -1, col: 0 },
          { row: -1, col: 1 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 },
        ];
        bdirections.forEach(bdirection => {
          const newRow = row + bdirection.row;
          const newCol = col + bdirection.col;
          if (isValidPosition(newRow, newCol) && (board[newRow][newCol] === 'Empty' || board[newRow][newCol].charAt(0) !== color)) {
            validMoves.push({ row: newRow, col: newCol });
          }
        }); 
        switchTurn(); // Switch turn after a valid move
      }
      break;
    default:
      break;
  }

  return validMoves;
};

module.exports = { getValidMoves, switchTurn };

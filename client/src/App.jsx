import { useState } from "react";
import "./App.css";

function App() {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [board, setBoard] = useState(Array(64).fill(0));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem("blockBlitzBest")) || 0 );
  const [gameOver, setGameOver] = useState(false);

  const pieceShapes = {
    single: [0],
    domino: [0, 1],
    line3: [0, 1, 2],
    line4: [0, 1, 2, 3],
    line5: [0, 1, 2, 3, 4],
    square: [0, 1, 8, 9],
    L: [0, 8, 16, 17],
    reversal: [1, 9, 16, 17],
    T: [0, 1, 2, 9],
    smallT: [0, 1, 2, 8],
    corner: [0, 8, 9],
  };

  function startNewGame() {
    setBoard(Array(64).fill(0));
    setScore(0);
    setSelectedPiece(null);
    setGameOver(false);
    setAvailablePieces(generatePiece());
  }

  function generatePiece() {
    const shapeNames = Object.keys(pieceShapes);
    return Array.from({ length: 3 }, (_, index) => {
      const randomIndex = Math.floor(Math.random() * shapeNames.length);
      return {
        id: `${Date.now()}-${index}`,
        name: shapeNames[randomIndex],
      };
    });
  }

  const [availablePieces, setAvailablePieces] = useState(() => generatePiece());

  function canPieceFit(shape, currentBoard) {
    const cells = shape.map((offset) => ({
      row: Math.floor(offset / 8),
      col: offset % 8,
    }));

    for (let startRow = 0; startRow < 8; startRow++) {
      for (let startCol = 0; startCol < 8; startCol++) {
        const fits = cells.every(({ row, col }) => {
          const newRow = startRow + row;
          const newCol = startCol + col;

          return (
            newRow < 8 && newCol < 8 && currentBoard[newRow * 8 + newCol] === 0
          );
        });

        if (fits) return true;
      }
    }

    return false;
  }
  function placePiece(index) {
    if (!selectedPiece || gameOver ) return;

    const selectedPieceData = availablePieces.find((piece) => piece.id === selectedPiece);
    if (!selectedPieceData) return;
    const shape = pieceShapes[selectedPieceData.name];

    const clickedRow = Math.floor(index / 8);
    const clickedCol = index % 8;

    const shapeCells = shape.map((offset) => ({
      row: Math.floor(offset / 8),
      col: offset % 8,
    }));

    const maxRow = Math.max(...shapeCells.map((cell) => cell.row));
    const maxCol = Math.max(...shapeCells.map((cell) => cell.col));

    for (const clickedCell of shapeCells) {
      const startRow = clickedRow - clickedCell.row;
      const startCol = clickedCol - clickedCell.col;

      if (
        startRow < 0 ||
        startCol < 0 ||
        startRow + maxRow >= 8 ||
        startCol + maxCol >= 8
      ) {
        continue;
      }

      const positions = shapeCells.map((cell) => ({
        row: startRow + cell.row,
        col: startCol + cell.col,
      }));

      const isValid = positions.every(
        ({ row, col }) => board[row * 8 + col] === 0,
      );

      if (!isValid) continue;

      const updatedBoard = [...board];

      positions.forEach(({ row, col }) => {
        updatedBoard[row * 8 + col] = 1;
      });

      const fullRows = [];

      for (let row = 0; row < 8; row++) {
        const isFull = updatedBoard
          .slice(row * 8, row * 8 + 8)
          .every((cell) => cell === 1);

        if (isFull) {
          fullRows.push(row);
        }
      }

      const fullCols = [];

      for (let col = 0; col < 8; col++) {
        const isFull = updatedBoard.every(
          (_, index) => index % 8 !== col || updatedBoard[index] === 1,
        );

        if (isFull) {
          fullCols.push(col);
        }
      }

      fullRows.forEach((row) => {
        for (let col = 0; col < 8; col++) {
          updatedBoard[row * 8 + col] = 0;
        }
      });

      fullCols.forEach((col) => {
        for (let row = 0; row < 8; row++) {
          updatedBoard[row * 8 + col] = 0;
        }
      });

      const linesCleared = fullRows.length + fullCols.length;
      const pointsEarned = shape.length + linesCleared * 10;
      setScore((previousScore) => previousScore + pointsEarned);

      setBoard(updatedBoard);
      const remainingPieces =  availablePieces.filter((piece) => piece.id !== selectedPiece);
      setSelectedPiece(null);
      if (remainingPieces.length === 0) {
  const newPieces = generatePiece();
  setAvailablePieces(newPieces);

  const noPieceFits = newPieces.every(
    (piece) =>
      !canPieceFit(pieceShapes[piece.name], updatedBoard)
  );

  if (noPieceFits) {
    setGameOver(true);
    setBestScore ((prevoiusBest) => Math.max(prevoiusBest, score + pointsEarned));
  }
  localStorage.setItem("blockBlitzBest", Math.max(bestScore, score + pointsEarned));

} else {
  setAvailablePieces(remainingPieces);

  const noPieceFits = remainingPieces.every(
    (piece) =>
      !canPieceFit(pieceShapes[piece.name], updatedBoard)
  );

  if (noPieceFits) {
    setGameOver(true);
    setBestScore ((prevoiusBest) => Math.max(prevoiusBest, score + pointsEarned));
  }
  localStorage.setItem("blockBlitzBest", Math.max(bestScore, score + pointsEarned));
}
      return;
    }
  }
  return (
    <div className="game-container">
      <h1>BLOCK BLITZ</h1>
      <p className="subtitle">Place blocks. Clear lines. Beat your best.</p>

      <div className="score-panel">
        <div className="score-box">
          <span> SCORE </span>
          <h2>{score}</h2>
        </div>

        <div className="score-box">
          <span> BEST </span>
          <h2>{bestScore}</h2>
        </div>
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <div
            className={`cell ${cell === 1 ? "occupied" : ""}`}
            key={index}
            onClick={() => {
              placePiece(index);
            }}
          ></div>
        ))}
      </div>

      {gameOver && <h2>GAME OVER!</h2>}

      <h3 className="pieces-title">YOUR BLOCKS</h3>

      <div className="pieces">
        {availablePieces.map((piece) => (
          <div
            key={piece.id}
            className={`piece piece-${piece.name} ${
              selectedPiece === piece.id ? "selected" : ""
            }`}
            onClick={() => setSelectedPiece(piece.id)}
          >
            {pieceShapes[piece.name].map((offset, blockIndex) => (
              <div
                className="block"
                key={blockIndex}
                style={{
                  gridRow: Math.floor(offset / 8) + 1,
                  gridColumn: (offset % 8) + 1,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={startNewGame}>NEW GAME</button>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";

function App() {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [board, setBoard] = useState(Array(64).fill(0));
  const pieceShapes = {
    L: [0, 8, 16, 17],
    square: [0, 1, 8, 9],
    T: [0, 1, 2, 9],
  };
  function placePiece(index) {
    if (!selectedPiece) return;

    const shape = pieceShapes[selectedPiece];
    const clickedRow = Math.floor(index / 8);
    const clickedCol = index % 8;

    const shapeCells = shape.map((offset) => ({
      row: Math.floor(offset / 8),
      col: offset % 8,
    }));

    const maxRow = Math.max(...shapeCells.map((cell) => cell.row));
    const maxCol = Math.max(...shapeCells.map((cell) => cell.col));

    // Try each block of the selected piece as the clicked block.
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

      // Find completed rows
      const fullRows = [];

      for (let row = 0; row < 8; row++) {
        const isFull = updatedBoard
          .slice(row * 8, row * 8 + 8)
          .every((cell) => cell === 1);

        if (isFull) {
          fullRows.push(row);
        }
      }

      // Find completed columns
      const fullCols = [];

      for (let col = 0; col < 8; col++) {
        const isFull = updatedBoard.every(
          (_, index) => index % 8 !== col || updatedBoard[index] === 1,
        );

        if (isFull) {
          fullCols.push(col);
        }
      }

      // Clear completed rows and columns
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
      setBoard(updatedBoard);
      setSelectedPiece(null);
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
          <h2>0</h2>
        </div>

        <div className="score-box">
          <span> BEST </span>
          <h2>0</h2>
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

      <h3 className="pieces-title">YOUR BLOCKS</h3>

      <div className="pieces">
        <div
          className={`piece piece-L ${selectedPiece === "L" ? "selected" : ""}`}
          onClick={() => setSelectedPiece("L")}
        >
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div
          className={`piece piece-square ${selectedPiece === "square" ? "selected" : ""}`}
          onClick={() => setSelectedPiece("square")}
        >
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div
          className={`piece piece-T ${selectedPiece === "T" ? "selected" : ""}`}
          onClick={() => setSelectedPiece("T")}
        >
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
          <div className="block"></div>
        </div>
      </div>

      <button className="restart-button">NEW GAME</button>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";
import "./App.css";
import { checkBackend } from "./api";
import { submitGameResult } from "./api";

const pieceColors = {
  single: "#ff6b6b",
  domino: "#4dabf7",
  line3: "#51cf66",
  line4: "#51cf66",
  line5: "#51cf66",
  square: "#ffd43b",
  L: "#cc5de8",
  reversal: "#cc5de8",
  T: "#ff922b",
  smallT: "#ff922b",
  corner: "#20c997",
};

function App() {
  useEffect(() => {
    checkBackend()
      .then((data) => console.log("Backend connected:", data.message))
      .catch((error) => console.log("Backend connecton failed:",error));
  }, []);
  const pieceShapes = {
    single: [0], domino: [0, 1], line3: [0, 1, 2],
    line4: [0, 1, 2, 3], line5: [0, 1, 2, 3, 4],
    square: [0, 1, 8, 9], L: [0, 8, 16, 17],
    reversal: [1, 9, 16, 17], T: [0, 1, 2, 9],
    smallT: [0, 1, 2, 8], corner: [0, 8, 9],
  };

  function generatePiece() {
    const shapeNames = Object.keys(pieceShapes);
    return Array.from({ length: 3 }, (_, index) => ({
      id: `${Date.now()}-${Math.random()}-${index}`,
      name: shapeNames[Math.floor(Math.random() * shapeNames.length)],
    }));
  }

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [touchDrag, setTouchDrag] = useState(null);
  const [board, setBoard] = useState(() => Array(64).fill(0));
  const [clearingCells, setClearingCells] = useState([]);
  const [multiClear, setMultiClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("blockBlitzBest")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [availablePieces, setAvailablePieces] = useState(() => generatePiece());
  const clearTimer = useRef(null);

  function startNewGame() {
    if (clearTimer.current !== null) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    setBoard(Array(64).fill(0));
    setClearingCells([]);
    setMultiClear(false);
    setIsClearing(false);
    setScore(0);
    setSelectedPiece(null);
    setPreviewIndex(null);
    setGameOver(false);
    setAvailablePieces(generatePiece());
  }

  // All shapes use their first block as the anchor for both preview and placement.
  function getShapeCells(shape) {
    const firstOffset = shape[0];
    const firstRow = Math.floor(firstOffset / 8);
    const firstCol = firstOffset % 8;
    return shape.map((offset) => ({
      row: Math.floor(offset / 8) - firstRow,
      col: (offset % 8) - firstCol,
    }));
  }

  function canPieceFit(shape, currentBoard) {
    const cells = getShapeCells(shape);
    for (let startRow = 0; startRow < 8; startRow++) {
      for (let startCol = 0; startCol < 8; startCol++) {
        const fits = cells.every(({ row, col }) => {
          const r = startRow + row;
          const c = startCol + col;
          return (
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8 &&
            currentBoard[r * 8 + c] === 0
          );
        });
        if (fits) return true;
      }
    }
    return false;
  }

  async function finishGame(finalScore) {
    setGameOver(true);
    setSelectedPiece(null);
    setPreviewIndex(null);
    const updatedBest = Math.max(bestScore, finalScore);
    setBestScore(updatedBest);
    localStorage.setItem("blockBlitzBest", String(updatedBest));

    try {
      const result = await submitGameResult(finalScore, updatedBest);
      console.log("Game result saved to backend:", result.message);
    } catch (error) {
      console.error("Failed to send game result:", error);
    }
  }

  function handleDragStart(event, pieceId) {
    if (gameOver || isClearing) {
      event.preventDefault();
      return;
    }
    setSelectedPiece(pieceId);
    setPreviewIndex(null);
    event.dataTransfer.setData("text/plain", pieceId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handlePointerDown(event, pieceId) {
  if (event.pointerType === "mouse" || gameOver || isClearing) return;

  event.preventDefault();
  setSelectedPiece(pieceId);
  setTouchDrag({ pieceId });
  setPreviewIndex(null);
}

function handlePointerMove(event) {
  if (!touchDrag || gameOver || isClearing) return;

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const cell = element?.closest(".cell");

  if (cell && cell.dataset.index !== undefined) {
    setPreviewIndex(Number(cell.dataset.index));
  } else {
    setPreviewIndex(null);
  }
}

function handlePointerUp(event) {
  if (!touchDrag) return;

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const cell = element?.closest(".cell");

  if (
    cell &&
    cell.dataset.index !== undefined &&
    !gameOver &&
    !isClearing
  ) {
    placePiece(Number(cell.dataset.index), touchDrag.pieceId);
  }

  setTouchDrag(null);
  setSelectedPiece(null);
  setPreviewIndex(null);
}

  function getPreview(index, pieceId = selectedPiece) {
    if (index === null || index === undefined || !pieceId) {
      return { cells: [], valid: false };
    }
    const piece = availablePieces.find((item) => item.id === pieceId);
    if (!piece) return { cells: [], valid: false };
    const anchorRow = Math.floor(index / 8);
    const anchorCol = index % 8;
    const cells = getShapeCells(pieceShapes[piece.name]).map(({ row, col }) => {
      const r = anchorRow + row;
      const c = anchorCol + col;
      return { row: r, col: c, index: r * 8 + c };
    });
    const valid = cells.every(
      ({ row, col, index: cellIndex }) =>
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8 &&
        board[cellIndex] === 0
    );
    return { cells, valid };
  }

  function placePiece(index, pieceId = selectedPiece) {
    if (!pieceId || gameOver || isClearing) return;
    const pieceData = availablePieces.find((piece) => piece.id === pieceId);
    if (!pieceData) return;
    const shape = pieceShapes[pieceData.name];
    const anchorRow = Math.floor(index / 8);
    const anchorCol = index % 8;
    const positions = getShapeCells(shape).map(({ row, col }) => ({
      row: anchorRow + row,
      col: anchorCol + col,
    }));
    const valid = positions.every(
      ({ row, col }) =>
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8 &&
        board[row * 8 + col] === 0
    );
    if (!valid) {
      setPreviewIndex(index);
      return;
    }
    const updatedBoard = [...board];
    positions.forEach(({ row, col }) => {
      updatedBoard[row * 8 + col] = {
        filled: true,
        color: pieceColors[pieceData.name] || "#4dabf7",
      };
    });
    const fullRows = [];
    for (let row = 0; row < 8; row++) {
      if (updatedBoard.slice(row * 8, row * 8 + 8).every((cell) => cell.filled )) {
        fullRows.push(row);
      }
    }
    const fullCols = [];
    for (let col = 0; col < 8; col++) {
      if (updatedBoard.every((cell, i) => i % 8 !== col || cell.filled )) {
        fullCols.push(col);
      }
    }
    const cellsToClear = new Set();
    fullRows.forEach((row) => {
      for (let col = 0; col < 8; col++) cellsToClear.add(row * 8 + col);
    });
    fullCols.forEach((col) => {
      for (let row = 0; row < 8; row++) cellsToClear.add(row * 8 + col);
    });
    const clearedCellIndexes = [...cellsToClear];
    const nextBoard = [...updatedBoard];
    clearedCellIndexes.forEach((cellIndex) => {
      nextBoard[cellIndex] = 0;
    });
    const linesCleared = fullRows.length + fullCols.length;
    const nextScore = score + shape.length + linesCleared * 10;
    setScore(nextScore);
    setSelectedPiece(null);
    setPreviewIndex(null);
    const remainingPieces = availablePieces.filter((piece) => piece.id !== pieceId);
    const nextPieces =
      remainingPieces.length === 0 ? generatePiece() : remainingPieces;
    setAvailablePieces(nextPieces);
    if (clearedCellIndexes.length > 0) {
      setIsClearing(true);
      setClearingCells(clearedCellIndexes);
      setMultiClear(linesCleared >= 2);
      setBoard(updatedBoard);
      clearTimer.current = setTimeout(() => {
        setBoard(nextBoard);
        setClearingCells([]);
        setMultiClear(false);
        setIsClearing(false);
        clearTimer.current = null;
      }, multiClearDuration(linesCleared));
    } else {
      setBoard(nextBoard);
    }
    const hasValidMove = nextPieces.some((piece) =>
      canPieceFit(pieceShapes[piece.name], nextBoard)
    );
    if (!hasValidMove) finishGame(nextScore);
  }

  function multiClearDuration(linesCleared) {
    return linesCleared >= 2 ? 320 : 260;
  }

  return (
    <div className="game-container" onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerUp} >
      <h1>BLOCK BLITZ</h1>
      <p className="subtitle">Place blocks. Clear lines. Beat your best.</p>
      <div className="score-panel">
        <div className="score-box"><span>SCORE</span><h2>{score}</h2></div>
        <div className="score-box"><span>BEST</span><h2>{bestScore}</h2></div>
      </div>
      <div className="board">
        {board.map((cell, index) => {
          const preview = getPreview(previewIndex, selectedPiece);
          const isPreviewCell = preview.cells.some((item) => item.index === index);
          return (
            <div
              key={index}
              data-index = {index}
              className={`cell ${cell && cell.filled ? "occupied" : ""} 
              style = {
              cell && cell.filled ? {
              backgroundColor: cell.color } : undefined } ${
                clearingCells.includes(index) ? "clearing" : ""
              } ${
                clearingCells.includes(index) && multiClear ? "multi-clear" : ""
              } ${
                isPreviewCell
                  ? preview.valid ? "preview-valid" : "preview-invalid"
                  : ""
              }`}
              onMouseEnter={() => {
                if (selectedPiece && !gameOver && !isClearing) setPreviewIndex(index);
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                if (!gameOver && !isClearing) setPreviewIndex(index);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (!gameOver && !isClearing) setPreviewIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const pieceId = event.dataTransfer.getData("text/plain");
                if (pieceId && !gameOver && !isClearing) placePiece(index, pieceId);
              }}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="game-over-message">
          <h2>GAME OVER!</h2>
          <p>Final Score: {score}</p>
          <p>Best Score: {bestScore}</p>
          <button className="restart-button" onClick={startNewGame}>PLAY AGAIN</button>
        </div>
      )}
      <div className="pieces">
        {availablePieces.map((piece) => (
          <div
            key={piece.id}
            draggable={!gameOver && !isClearing}
            onDragStart={(event) => handleDragStart(event, piece.id)}
            onPointerDown={(event) => handlePointerDown(event, piece.id)}
            onDragEnd={() => {
              setPreviewIndex(null);
              setSelectedPiece(null);
            }}
            className={`piece piece-${piece.name} ${selectedPiece === piece.id ? "selected" : ""}`}
          >
            {pieceShapes[piece.name].map((offset, blockIndex) => (
              <div
                className="block"
                key={blockIndex}
                style={{
                  gridRow: Math.floor(offset / 8) + 1,
                  gridColumn: (offset % 8) + 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {!gameOver && (
        <button className="restart-button" onClick={startNewGame}>NEW GAME</button>
      )}
    </div>
  );
}

export default App;
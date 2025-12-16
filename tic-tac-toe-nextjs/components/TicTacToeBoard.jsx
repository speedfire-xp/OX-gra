"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { defaultSettings } from "@/lib/settings";


function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

export default function TicTacToeBoard({
  initialSize = 10,
  settings = defaultSettings,
  gameId,
}) {
  const { user } = useAuth();
  const [saveMessage, setSaveMessage] = useState("");
  const [size, setSize] = useState(initialSize);
  const [board, setBoard] = useState(() => createEmptyBoard(initialSize));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null); // "X" | "O" | "draw" | null
  const [xMoves, setXMoves] = useState(0);
  const [oMoves, setOMoves] = useState(0);

  const [loadingSavedGame, setLoadingSavedGame] = useState(false);
  const [loadError, setLoadError] = useState("");
  const mergedSettings = { ...defaultSettings, ...settings };
  const { boardBgColor, xColor, oColor, borderColor, cellSize, symbolSize } =
    mergedSettings;

  const totalCells = size * size;
  const movesMade = xMoves + oMoves;
  const freeCells = totalCells - movesMade;
  // Wczytywanie zapisanej gry na podstawie gameId
  useEffect(() => {
    if (!gameId) return; // jeśli weszliśmy bez gameId -> nowa gra

    async function loadGame() {
      try {
        setLoadingSavedGame(true);
        setLoadError("");
        setSaveMessage("");

        const ref = doc(db, "games", gameId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setLoadError("Nie znaleziono zapisanej gry.");
          return;
        }

        const data = snap.data();
        const loadedSize = data.size || initialSize;
        const flatBoard = data.board || [];

        // 1D -> 2D
        const board2D = [];
        for (let r = 0; r < loadedSize; r++) {
          board2D.push(flatBoard.slice(r * loadedSize, (r + 1) * loadedSize));
        }

        setSize(loadedSize);
        setBoard(board2D);
        setCurrentPlayer(data.currentPlayer || "X");
        setXMoves(data.xMoves ?? 0);
        setOMoves(data.oMoves ?? 0);
        setWinner(data.winner ?? null);
      } catch (err) {
        console.error("Błąd wczytywania gry:", err);
        setLoadError("Nie udało się wczytać zapisanej gry.");
      } finally {
        setLoadingSavedGame(false);
      }
    }

    loadGame();
  }, [gameId, initialSize]);

  function handleCellClick(row, col) {
    if (winner) return;
    if (board[row][col] !== "") return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    if (currentPlayer === "X") setXMoves((c) => c + 1);
    else setOMoves((c) => c + 1);

    const winLength = size;
    const maybeWinner = checkWinner(newBoard, row, col, currentPlayer, winLength);

    if (maybeWinner) {
      setBoard(newBoard);
      setWinner(maybeWinner);
      return;
    }

    const newMoves = movesMade + 1;
    if (newMoves === totalCells) {
      setBoard(newBoard);
      setWinner("draw");
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
  }

  function handleNewGame() {
    setBoard(createEmptyBoard(size));
    setCurrentPlayer("X");
    setWinner(null);
    setXMoves(0);
    setOMoves(0);
    setSaveMessage("");
  }

  function handleChangeSize(e) {
    const newSize = Number(e.target.value) || 5;
    setSize(newSize);
    setBoard(createEmptyBoard(newSize));
    setCurrentPlayer("X");
    setWinner(null);
    setXMoves(0);
    setOMoves(0);
    setSaveMessage("");
  }

  async function handleSaveGame() {
    if (!user) {
      setSaveMessage("Musisz być zalogowany, aby zapisać grę.");
      return;
    }

    try {
      const flatBoard = board.flat();

      await addDoc(collection(db, "games"), {
        uid: user.uid,
        size,
        board: flatBoard, // zapis spłaszczonej tablicy
        currentPlayer,
        xMoves,
        oMoves,
        winner,
        createdAt: serverTimestamp(),
      });
      setSaveMessage("Gra została zapisana w Firestore ✅");
    } catch (err) {
      console.error(err);
      setSaveMessage("Błąd podczas zapisywania gry.");
    }
  }

  return (
    <div className="game-container flex flex-col md:flex-row gap-6">
      <div className="game-info w-full md:w-64">
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text font-semibold">
              Rozmiar planszy (n×n):
            </span>
          </label>
          <input
            type="number"
            min="3"
            max="15"
            value={size}
            onChange={handleChangeSize}
            className="input input-bordered"
          />
        </div>

        <p>
          Aktualny gracz: <strong>{currentPlayer}</strong>
        </p>
        <p>
          Ruchy X: {xMoves} | Ruchy O: {oMoves}
        </p>
        <p>Wolne pola: {freeCells}</p>

        {winner && (
          <p className="winner mt-2 text-success font-semibold">
            {winner === "draw"
              ? "Remis – brak wolnych pól."
              : `Wygrał gracz ${winner}!`}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <button className="btn btn-primary" onClick={handleNewGame}>
            Nowa gra
          </button>
          <button className="btn btn-secondary" onClick={handleSaveGame}>
            Zapisz grę
          </button>
        </div>

        {saveMessage && <p className="mt-3 text-sm">{saveMessage}</p>}
      </div>

      <div className="board-wrapper flex justify-center overflow-auto">
        <div
          className="board inline-grid"
          style={{
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isX = cell === "X";
              const isO = cell === "O";

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  className="cell flex items-center justify-center rounded-md border bg-base-100 shadow-sm hover:shadow-md transition"
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    fontSize: `${symbolSize}px`,
                    borderColor,
                    backgroundColor: boardBgColor,
                    color: isX ? xColor : isO ? oColor : "#000000",
                  }}
                >
                  {cell}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sprawdza, czy po ruchu (row, col) jest inRow pól w linii.
 */
function checkWinner(board, row, col, player) {
  const directions = [
    [1, 0],   // pion
    [0, 1],   // poziom
    [1, 1],   // ukośnie \
    [1, -1],  // ukośnie /
  ];

  const size = board.length;
  const inRow = 5; // ✅ zawsze 5, niezależnie od rozmiaru planszy

  for (const [dr, dc] of directions) {
    let count = 1;

    let r = row + dr;
    let c = col + dc;
    while (
      r >= 0 &&
      r < size &&
      c >= 0 &&
      c < size &&
      board[r][c] === player
    ) {
      count++;
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (
      r >= 0 &&
      r < size &&
      c >= 0 &&
      c < size &&
      board[r][c] === player
    ) {
      count++;
      r -= dr;
      c -= dc;
    }

    if (count >= inRow) {
      return player;
    }
  }

  return null;
}
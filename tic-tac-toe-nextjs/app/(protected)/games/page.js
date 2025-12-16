"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";

function formatDate(date) {
  if (!date) return "-";
  return date.toLocaleString("pl-PL");
}

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadGames = async () => {
      try {
        const gamesRef = collection(db, "games");
        const q = query(gamesRef, where("uid", "==", user.uid));

        const snap = await getDocs(q);
        const items = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt?.toDate?.() ?? null;

          let statusLabel = "W trakcie";
          if (data.winner === "draw") statusLabel = "Remis";
          else if (data.winner === "X") statusLabel = "Wygrana: X";
          else if (data.winner === "O") statusLabel = "Wygrana: O";

          return {
            id: docSnap.id,
            size: data.size,
            winner: data.winner,
            statusLabel,
            createdAt,
            movesX: data.xMoves,
            movesO: data.oMoves,
          };
        });

        items.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt - a.createdAt;
        });

        setGames(items);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać zapisanych gier.");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [user]);

  if (!user) return null;

  const handleLoad = (id) => {
    router.push(`/game?gameId=${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "games", id));
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      setError("Nie udało się usunąć gry.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <h2 className="text-xl font-bold mb-4">🎮 Twoje zapisane gry ({games.length})</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {games.length === 0 ? (
        <p>Nie masz jeszcze żadnych zapisanych gier.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Data</th>
                <th>Rozmiar</th>
                <th>Ruchy X</th>
                <th>Ruchy O</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.id}>
                  <td>{formatDate(g.createdAt)}</td>
                  <td>{g.size}×{g.size}</td>
                  <td>{g.movesX ?? "-"}</td>
                  <td>{g.movesO ?? "-"}</td>
                  <td>{g.statusLabel}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleLoad(g.id)}
                    >
                      📂 Wczytaj
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDelete(g.id)}
                    >
                      🗑 Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

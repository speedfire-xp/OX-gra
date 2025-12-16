"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TicTacToeBoard from "@/components/TicTacToeBoard";
import { loadSettings } from "@/lib/settings";

export default function GamePage() {
  const [settings] = useState(() => loadSettings());
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId"); // ← gameId z URL

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <h2 className="text-xl font-bold mb-4">Gra w kółko i krzyżyk n×n</h2>
      {/* ← przekazujemy gameId do planszy */}
      <TicTacToeBoard initialSize={10} settings={settings} gameId={gameId} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { defaultSettings, loadSettings, saveSettings } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "cellSize" || name === "symbolSize" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings(settings);
    setMessage("Ustawienia zapisane 🎉");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    setMessage("Przywrócono domyślne ustawienia ✅");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-2">
            Ustawienia wyglądu planszy
          </h2>
          <p className="text-sm mb-3">
            Zmień kolory i rozmiary, a następnie zapisz. Ustawienia są
            przechowywane w przeglądarce.
          </p>

          {message && (
            <div className="alert alert-success py-2 mb-2">
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Kolor tła pól</span>
              </label>
              <input
                type="color"
                name="boardBgColor"
                value={settings.boardBgColor}
                onChange={handleChange}
                className="input input-bordered h-10 w-24 p-1"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kolor symbolu X</span>
              </label>
              <input
                type="color"
                name="xColor"
                value={settings.xColor}
                onChange={handleChange}
                className="input input-bordered h-10 w-24 p-1"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kolor symbolu O</span>
              </label>
              <input
                type="color"
                name="oColor"
                value={settings.oColor}
                onChange={handleChange}
                className="input input-bordered h-10 w-24 p-1"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kolor krawędzi pól</span>
              </label>
              <input
                type="color"
                name="borderColor"
                value={settings.borderColor}
                onChange={handleChange}
                className="input input-bordered h-10 w-24 p-1"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rozmiar pola (px)</span>
              </label>
              <input
                type="number"
                name="cellSize"
                min={30}
                max={120}
                value={settings.cellSize}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rozmiar symbolu (px)</span>
              </label>
              <input
                type="number"
                name="symbolSize"
                min={16}
                max={80}
                value={settings.symbolSize}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-4 flex flex-row gap-2">
              <button type="submit" className="btn btn-primary flex-1">
                Zapisz ustawienia
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline flex-1"
              >
                Domyślne
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

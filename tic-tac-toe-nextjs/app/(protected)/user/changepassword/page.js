"use client";

import { useState } from "react";
import { updatePassword, signOut } from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const newPassword = e.target.newPassword.value;
    const repeat = e.target.repeatPassword.value;

    if (newPassword.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      setLoading(false);
      return;
    }

    if (newPassword !== repeat) {
      setError("Hasła nie są takie same.");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setSuccess("Hasło zostało zmienione. Zaloguj się ponownie.");

      // 🔐 wyloguj po zmianie hasła
      await signOut(user.auth);

      setTimeout(() => {
        router.push("/user/signin");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        "Nie udało się zmienić hasła. Sesja mogła wygasnąć — zaloguj się ponownie."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <form onSubmit={onSubmit} className="card-body">
          <h2 className="card-title text-2xl mb-3">Zmień hasło</h2>

          {error && (
            <div className="alert alert-error py-2">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success py-2">
              <span>{success}</span>
            </div>
          )}

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Nowe hasło</span>
            </label>
            <input
              name="newPassword"
              type="password"
              className="input input-bordered"
              placeholder="min. 6 znaków"
              required
              disabled={loading}
            />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Powtórz nowe hasło</span>
            </label>
            <input
              name="repeatPassword"
              type="password"
              className="input input-bordered"
              required
              disabled={loading}
            />
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Zmienianie..." : "Zmień hasło"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

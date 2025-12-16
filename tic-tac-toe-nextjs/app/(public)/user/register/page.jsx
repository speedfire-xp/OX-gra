"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  // jeśli ktoś jest zalogowany, nie ma sensu pokazywać rejestracji
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="alert alert-info w-full max-w-md">
          <span>Jesteś już zalogowany jako {user.email}.</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const repeat = form.repeatPassword.value;

    // walidacja haseł
    if (password !== repeat) {
      setRegisterError("Hasła nie są takie same.");
      setLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered!", cred.user);

      // zapamiętujemy email do ekranu verify
      if (typeof window !== "undefined") {
        sessionStorage.setItem("registeredEmail", email);
      }

      await sendEmailVerification(auth.currentUser);
      console.log("Email verification send!");

      // automatyczne wylogowanie
      await signOut(auth);

      // przekierowanie na stronę weryfikacji
      router.push("/user/verify");
    } catch (error) {
      console.dir(error);
      if (error.code === "auth/email-already-in-use") {
        setRegisterError(
          "Użytkownik z tym adresem email już istnieje. Spróbuj się zalogować."
        );
      } else if (error.code === "auth/weak-password") {
        setRegisterError("Hasło jest za słabe (minimum 6 znaków).");
      } else {
        setRegisterError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Rejestracja</h2>

          {registerError && (
            <div className="alert alert-error mb-4">
              <span>{registerError}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Hasło</span>
              </label>
              <input
                name="password"
                type="password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Powtórz hasło</span>
              </label>
              <input
                name="repeatPassword"
                type="password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Rejestrowanie..." : "Zarejestruj się"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut,
  getAuth,
} from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();

  const returnUrl = params.get("returnUrl") || "/";
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = e.target["email"].value;
    const password = e.target["password"].value;

    try {
      await setPersistence(auth, browserSessionPersistence);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // ⬇️ Logowanie użytkownika bez zweryfikowanego emaila
      if (!user.emailVerified) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("registeredEmail", user.email || email);
        }

        await signOut(auth);
        router.push("/user/verify");
        return;
      }

      // wszystko OK – przekierowanie
      router.push(returnUrl || "/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setError("Niepoprawny email lub hasło.");
      } else if (err.code === "auth/user-disabled") {
        setError("Konto użytkownika zostało zablokowane.");
      } else {
        setError("Nie udało się zalogować. Spróbuj ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <form onSubmit={onSubmit} className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">
            Logowanie
          </h2>

          {error && (
            <div className="alert alert-error py-2">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="podaj email"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Hasło</span>
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="•••••••"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj"}
            </button>
          </div>

          <p className="text-center text-sm mt-4">
            Nie masz konta?{" "}
            <Link className="text-primary" href="/user/register">
              Zarejestruj się
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

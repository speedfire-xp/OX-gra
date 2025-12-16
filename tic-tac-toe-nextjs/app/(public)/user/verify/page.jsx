"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

export default function VerifyEmailPage() {
  // inicjalizacja stanu tylko raz, bez useEffect
  const [registeredEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("registeredEmail");
      return stored || "";
    }
    return "";
  });

  useEffect(() => {
    // tylko efekt uboczny – wylogowanie
    signOut(getAuth()).catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card bg-base-100 shadow-xl max-w-xl w-full">
        <div className="card-body">
          <h2 className="card-title mb-2">Potwierdź swój adres email</h2>
          <p className="mb-2">
            Wysłaliśmy wiadomość z linkiem aktywacyjnym na adres:
          </p>
          <p className="font-semibold mb-4">
            {registeredEmail || "Twój adres email"}
          </p>
          <p className="text-sm opacity-70">
            Kliknij w link w wiadomości, aby aktywować konto. Po
            zweryfikowaniu adresu możesz się ponownie zalogować.
          </p>
        </div>
      </div>
    </div>
  );
}

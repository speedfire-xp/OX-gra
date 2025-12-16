"use client";

import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signOut(getAuth());
      router.push("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title justify-center mb-2">Wylogowanie</h2>
          <p className="text-center text-sm opacity-70 mb-4">
            Czy na pewno chcesz się wylogować?
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <button
              type="submit"
              className="btn btn-error w-full"
              disabled={loading}
            >
              {loading ? "Wylogowywanie..." : "Wyloguj"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

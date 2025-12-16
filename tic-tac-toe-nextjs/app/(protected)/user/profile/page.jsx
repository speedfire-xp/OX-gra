"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Ładowanie profilu...</div>;
  }

  if (!user) {
    return (
      <div className="alert alert-warning my-4">
        <span>Musisz być zalogowany, aby zobaczyć profil.</span>
      </div>
    );
  }

  return <ProfileForm user={user} />;
}

function ProfileForm({ user }) {
  // podstawowe dane z auth
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user.photoURL ?? "");
  const [email] = useState(user.email ?? "");

  // adres z Firestore
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);

  // komunikaty
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔽 Zadanie 4 – odczyt adresu z kolekcji users
  useEffect(() => {
    let cancelled = false;

    async function loadAddress() {
      try {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          // brak dokumentu – zostaw puste pola
          if (!cancelled) setAddressLoading(false);
          return;
        }

        const data = snapshot.data();
        const address = data.address || {};

        if (!cancelled) {
          setStreet(address.street || "");
          setCity(address.city || "");
          setZipCode(address.zipCode || "");
          setAddressLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Nie udało się wczytać adresu użytkownika.");
          setAddressLoading(false);
        }
      }
    }

    loadAddress();

    return () => {
      cancelled = true;
    };
  }, [user.uid]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1) aktualizacja profilu w auth
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // 2) zapis / aktualizacja dokumentu w kolekcji users (Zadanie 1)
      await setDoc(
        doc(db, "users", user.uid),
        {
          address: {
            city,
            street,
            zipCode,
          },
        },
        { merge: true } // żeby nie nadpisać ewentualnych innych pól
      );

      setSuccess("Profil i adres zostały zaktualizowane.");
    } catch (err) {
      console.error(err);
      if (err.code === "permission-denied") {
        setError(
          "Brak uprawnień do zapisu danych użytkownika (sprawdź reguły Firestore)."
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-2">Profil użytkownika</h2>

          {/* Avatar (Zad. 5 z Lab 8) */}
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar">
              {photoURL ? (
                <div className="w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoURL} alt="Avatar" />
                </div>
              ) : (
                <div className="w-16 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-2xl">
                  {email.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{displayName || "Brak nazwy"}</p>
              <p className="text-sm opacity-70">{email}</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-3">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-3">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* nazwa */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nazwa wyświetlana</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            {/* email (readonly) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email (tylko do odczytu)</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-base-200"
                value={email}
                readOnly
              />
            </div>

            {/* photoURL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Adres zdjęcia profilowego</span>
              </label>
              <input
                type="url"
                className="input input-bordered w-full"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>

            {/* 🔽 Nowe pola adresu – Zadanie 1 */}
            <div className="divider">Adres</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Ulica</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                disabled={addressLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Miasto</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={addressLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kod pocztowy</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                disabled={addressLoading}
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addressLoading}
              >
                {addressLoading ? "Ładowanie adresu..." : "Zapisz zmiany"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

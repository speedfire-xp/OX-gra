"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { href: "/", label: "Strona główna" },
  { href: "/game", label: "Graj" },
  { href: "/games", label: "Zapisane gry" },
  { href: "/settings", label: "Ustawienia" },
  { href: "/user/changepassword", label: "Zmień hasło" },
];

function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`btn btn-sm ${
        active
          ? "btn-primary"
          : "btn-ghost"
      }`}
    >
      {children}
    </Link>
  );
}

export default function ClientLayout({ children }) {
  const { user, loading } = useAuth();
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-30">
        {/* LOGO */}
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            O X GRA
          </Link>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="hidden md:flex gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* AUTH ACTIONS */}
        <div className="flex gap-2 items-center ml-4">
          {!loading && user ? (
            <>
              <span className="text-sm opacity-70 hidden lg:block max-w-[200px] truncate">
                {user.email}
              </span>
              <Link href="/user/signout" className="btn btn-sm btn-error">
                Wyloguj
              </Link>
            </>
          ) : (
            <>
              <Link href="/user/signin" className="btn btn-sm btn-outline">
                Logowanie
              </Link>
              <Link href="/user/register" className="btn btn-sm btn-primary">
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">{children}</div>
          </div>
        </div>
      </main>


    </div>
  );
}

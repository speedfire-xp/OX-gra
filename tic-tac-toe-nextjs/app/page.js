"use client";

import Link from "next/link";

// --- KONFIGURACJA PRZYCISKÓW (WERSJA DARK) ---

const mainAction = {
  title: "Rozpocznij Grę",
  desc: "Wejdź na arenę i zmierz się w klasycznym pojedynku kółko i krzyżyk.",
  href: "/game",
  icon: "🎮",
};

const secondaryActions = [
  {
    title: "Zapisane gry",
    href: "/games",
    icon: "🗂",
    // Ciemne tła, jasne obramowania i tekst
    colorClass: "border-blue-500 text-blue-300 hover:bg-blue-900/30",
  },
  {
    title: "Ustawienia",
    href: "/settings",
    icon: "⚙️",
    colorClass: "border-gray-500 text-gray-300 hover:bg-gray-800/50",
  },

  {
    title: "Zmień hasło",
    href: "/user/changepassword",
    icon: "🔑",
    colorClass: "border-yellow-500 text-yellow-300 hover:bg-yellow-900/30",
  },
];

// --- KOMPONENTY ---

// 1. Główny Baner (Hero) - Biały obrys na czarnym tle
function HeroBanner({ action }) {
  return (
    <Link
      href={action.href}
      className="group relative block w-full overflow-hidden rounded-xl border-4 border-white bg-neutral-900 text-white transition-transform hover:scale-[1.01]"
    >
      <div className="relative flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-12">
        <div className="text-center md:text-left">
          <h1 className="mb-3 flex flex-col items-center gap-3 text-3xl font-black tracking-tight md:flex-row md:text-5xl">
            <span className="text-5xl">{action.icon}</span>
            {action.title}
          </h1>
          <p className="mx-auto max-w-md text-lg font-medium opacity-80 md:mx-0">
            {action.desc}
          </p>
        </div>
        
        <div className="flex-none">
          <span className="btn btn-primary btn-lg rounded-lg border-2 border-white px-10 font-bold uppercase tracking-wide text-white hover:border-white hover:bg-white hover:text-black">
            Graj teraz
          </span>
        </div>
      </div>
    </Link>
  );
}

// 2. Karta Nawigacyjna - Przezroczyste tło, kolorowy obrys
function QuickLinkCard({ title, href, icon, colorClass }) {
  return (
    <Link
      href={href}
      className={`group flex items-center rounded-lg border-2 bg-black/50 p-5 transition-all hover:-translate-y-1 ${colorClass}`}
    >
      <div className="mr-5 text-3xl transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="text-xl font-bold opacity-40 transition-transform group-hover:translate-x-1">
        →
      </div>
    </Link>
  );
}

// --- GŁÓWNA STRONA ---

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-black p-4 text-white md:p-8">
      
      {/* GLOBALNE STYLE DLA STRONY GŁÓWNEJ */}
      <style jsx global>{`
        .drawer-content { display: block !important; }
        .navbar, .drawer-side, footer { display: none !important; }
        main { padding: 0 !important; }
        .card { box-shadow: none !important; border: none !important; background: transparent !important; }
        body { background-color: #000000 !important; color: #ffffff !important; }
      `}</style>

      <div className="mx-auto w-full max-w-5xl space-y-10">
        
        <header className="text-center pb-4">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-500">
            Projekt Zaliczeniowy
          </p>
          <h2 className="text-2xl font-bold text-white">
            O X GRA
          </h2>
        </header>

        <section>
          <HeroBanner action={mainAction} />
        </section>

        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {secondaryActions.map((item) => (
              <QuickLinkCard key={item.href} {...item} />
            ))}
          </div>
        </section>

        <footer className="pt-10 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} O X GRA. Wszelkie prawa zastrzeżone.</p>
        </footer>
        
      </div>
    </div>
  );
}
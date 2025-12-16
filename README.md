## Live aplikacja

https://ox-gra.vercel.app/

# TicTacToe NxN – Next.js + Firebase

Projekt w ramach **Laboratorium 6 – Temat 5**.

Aplikacja webowa przedstawiająca rozszerzoną wersję gry **kółko i krzyżyk** na planszy **N×N**, z systemem rejestracji użytkowników, zapisem gier oraz konfiguracją ustawień.

## Główne Funkcjonalności

Aplikacja wykracza poza standardową rozgrywkę, oferując:

Dynamiczna rozgrywka: Gra w kółko i krzyżyk na planszy o konfigurowalnym rozmiarze (N×N).

Logika gry: Automatyczne wykrywanie zwycięstwa oraz remisu dla dowolnego rozmiaru siatki.

System użytkowników: Pełna rejestracja, logowanie, wylogowywanie oraz edycja profilu (zmiana hasła).

Zapis w chmurze: Stan gry jest zapisywany w bazie danych, co pozwala na przerwanie i wznowienie rozgrywki.

Nowoczesny UI: Responsywny i estetyczny interfejs zbudowany w oparciu o bibliotekę DaisyUI.

---

## Technologia

Projekt został zbudowany w oparciu o nowoczesny stos technologiczny (Tech Stack):

Frontend: Next.js 16 (App Router), React

Stylizacja: Tailwind CSS, DaisyUI

Backend / BaaS: Firebase Authentication, Firebase Firestore

Deployment: Vercel

---

## Uruchomienie lokalnie

By uruchomić projekt na własnej maszynie, wykonaj poniższe kroki:

1. Sklonuj repozytorium

Bash

git clone https://github.com/MarcinPalys/TicTacToeNextJs.git
cd TicTacToeNextJs
(Upewnij się, że używasz właściwego linku do swojego repozytorium, jeśli zostało już zaktualizowane).

2. Zainstaluj zależności

npm install
3. Skonfiguruj zmienne środowiskowe

Utwórz plik .env.local w głównym katalogu projektu i uzupełnij go swoimi kluczami z Firebase:

NEXT_PUBLIC_API_KEY=twoj_klucz
NEXT_PUBLIC_AUTH_DOMAIN=twoj_projekt.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=twoj_projekt_id
NEXT_PUBLIC_STORAGE_BUCKET=twoj_bucket.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=twoje_id
NEXT_PUBLIC_APP_ID=twoje_app_id

4. Uruchom serwer deweloperski 
npm run dev
Aplikacja będzie dostępna pod adresem: http://localhost:3000.
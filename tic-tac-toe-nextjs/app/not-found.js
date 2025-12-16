import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center mt-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl mb-2">404 – Nie znaleziono</h2>
          <p className="mb-4">
            Strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>
          <Link href="/" className="btn btn-primary">
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}

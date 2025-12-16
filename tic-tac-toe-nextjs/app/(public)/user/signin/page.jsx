"use client";

import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6">Ładowanie...</div>}>
      <SignInForm />
    </Suspense>
  );
}

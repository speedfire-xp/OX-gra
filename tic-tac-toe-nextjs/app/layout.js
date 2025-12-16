import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }) {
  // Zmieniono 'cupcake' na 'black'
  return (
    <html lang="pl" data-theme="black">
      <body className="min-h-screen bg-black text-white">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
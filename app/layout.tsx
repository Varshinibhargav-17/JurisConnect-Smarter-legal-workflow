import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "LegalFlow - Add Matter",
  description: "Add new legal case/matter",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-bold">JurisConnect Dashboard</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}

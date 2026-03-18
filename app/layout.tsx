import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalaryNet — Calculateur salaire brut net",
  description: "Convertissez votre salaire brut en net après impôts dans plus de 20 pays. France, USA, Suisse, UK, Allemagne et bien plus.",
  keywords: "salaire brut net, calculateur salaire, impôts, charges sociales, comparaison internationale",
  openGraph: {
    title: "SalaryNet — Calculateur salaire brut → net",
    description: "Comparez votre salaire net dans 23 pays avec les vrais barèmes fiscaux 2024-2025.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: "#f5f6fa" }}>
        {children}
      </body>
    </html>
  );
}
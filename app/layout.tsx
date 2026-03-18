import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalaryNet 2026 — Calculateur Salaire Brut Net | 25 Pays",
  description: "Calculez votre salaire net après impôts et charges sociales en 2026. France, USA, Suisse, UK, Irlande, Luxembourg, Allemagne et 18 autres pays. Barèmes fiscaux officiels mis à jour.",
  keywords: [
    "calculateur salaire brut net",
    "salaire net 2026",
    "calcul salaire net france",
    "net salary calculator",
    "salaire brut net irlande",
    "salaire net suisse",
    "salaire net luxembourg",
    "calculateur impôts salaire",
    "charges sociales calcul",
    "comparaison salaire international",
    "gross to net salary",
    "salary calculator 2026",
    "net pay calculator",
    "income tax calculator",
    "salaire net allemagne",
  ],
  authors: [{ name: "SalaryNet" }],
  creator: "SalaryNet",
  publisher: "SalaryNet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mysalarynet.com",
  },
  openGraph: {
    title: "SalaryNet 2026 — Calculateur Salaire Brut → Net",
    description: "Comparez votre salaire net dans 25 pays avec les vrais barèmes fiscaux 2026. France, Irlande, Suisse, USA, UK, Luxembourg et plus.",
    url: "https://mysalarynet.com",
    siteName: "SalaryNet",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalaryNet 2026 — Calculateur Salaire Brut Net",
    description: "Calculez et comparez votre salaire net dans 25 pays. Barèmes fiscaux 2026 officiels.",
    creator: "@mysalarynet",
  },
  metadataBase: new URL("https://mysalarynet.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://mysalarynet.com" />
        <meta name="theme-color" content="#6366f1" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900966325166915" crossOrigin="anonymous"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SalaryNet",
              "url": "https://mysalarynet.com",
              "description": "Calculateur de salaire brut net pour 25 pays avec barèmes fiscaux 2026",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "featureList": [
                "Calcul salaire brut net",
                "25 pays disponibles",
                "Barèmes fiscaux 2026",
                "Comparaison internationale",
                "Conversion de devises"
              ]
            })
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#f5f6fa" }}>
        {children}
      </body>
    </html>
  );
}

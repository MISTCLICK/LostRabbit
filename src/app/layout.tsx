import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Lost Rabbit",
  description:
    "Rīgas 80. vidusskolas 12.b klases pētnieciskā darba eksperiments programmēšanas jomā.",
};

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}

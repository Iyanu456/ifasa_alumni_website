import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./providers";
import SuspenseWrapper from "./components/SuspenseBoundaryWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Ife Architecture Alumni Association",
  description: "Ife Architecture Alumni Association Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="grid min-h-screen pt-[5.9em]">
        <SuspenseWrapper>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </SuspenseWrapper>
      </body>
    </html>
  );
}

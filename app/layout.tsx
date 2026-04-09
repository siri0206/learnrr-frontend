import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LEARNRR.IN — Discover & Apply to Top Indian Universities",
  description: "India's futuristic admission portal. Explore universities, browse courses, view fees, syllabus, and apply online — all in one place. Based in Hyderabad, Telangana.",
  keywords: "admission portal, Indian universities, Hyderabad colleges, engineering MBA medical courses, online application",
  openGraph: {
    title: "LEARNRR.IN — Improve Admissions",
    description: "Discover top universities in Hyderabad and across India. Apply to your dream course in minutes.",
    siteName: "LEARNRR.IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

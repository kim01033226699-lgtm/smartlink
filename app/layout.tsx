import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Smart Link - Start Good, Grow Rich!",
  description: "굿리치 통합 정보 시스템",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

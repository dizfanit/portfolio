import type { Metadata } from "next";
import type { ReactNode } from "react";
import CustomCursor from "../components/CustomCursor";
import GridOverlay from "../components/GridOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIZFANIT DESIGN",
  description: "Portfolio of web designer DIZFANIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <CustomCursor />
        {children}
        <div className="crt-tv-frame" aria-hidden="true" />
        <GridOverlay />
      </body>
    </html>
  );
}

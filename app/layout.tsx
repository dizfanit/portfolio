import type { Metadata } from "next";
import type { ReactNode } from "react";
import CustomCursor from "../components/CustomCursor";
import GridOverlay from "../components/GridOverlay";
import "./globals.css";

const ENABLE_TV_EFFECT = false;

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
        {ENABLE_TV_EFFECT ? (
          <div className="crt-tv-frame" aria-hidden="true" />
        ) : null}
        <GridOverlay />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importamos los estilos base de leaflet para que el mapa no se vea roto
import "leaflet/dist/leaflet.css"; 
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WAWA Transport MVP",
  description: "Sistema de planificación de transporte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
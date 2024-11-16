import { Inter } from "next/font/google";
import 'leaflet/dist/leaflet.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TravelTracker",
  description: "Try Clicking on the Pins!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

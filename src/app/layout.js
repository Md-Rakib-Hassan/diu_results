import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DIU Results",
  description: "Created by Rakib Hassan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" theme-data="light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

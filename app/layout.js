import "./globals.css";

export const metadata = {
  title: "Vedic Horoscope",
  description: "Daily Bengali Vedic Horoscope API"
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
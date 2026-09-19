import "./globals.css";

export const metadata = {
  title: "Landing Builder",
  description: "Monte landing pages com imagens, vídeos, botões e carrosséis."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

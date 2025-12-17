import "./globals.css";

export const metadata = {
  title: "Lumi Vagalume",
  description: "Aprendizado infantil com RAG offline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-sky-50">
        {children}
      </body>
    </html>
  );
}

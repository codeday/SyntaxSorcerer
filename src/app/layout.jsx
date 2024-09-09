import "./globals.css";

export const metadata = {
  title: "Syntax Sorcerer",
  description: "AI Coding assistant designed with students in mind!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

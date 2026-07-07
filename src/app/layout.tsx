import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AuraMeet",
  description: "Convert audio recordings into structured meeting notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
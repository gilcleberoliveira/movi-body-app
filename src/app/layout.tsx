import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movi Body — Create a new identity",
  description: "Transform your life through consistent action. Stop consuming motivation. Start becoming.",
};

const THEME_INIT_SCRIPT = `
try {
  if (localStorage.getItem('movi-theme') === 'dark') {
    document.documentElement.classList.add('dark-bg');
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

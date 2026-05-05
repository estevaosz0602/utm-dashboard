import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "UTM Dashboard",
  description: "Dashboard de vendas com rastreamento UTM",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UTM Dashboard",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";

export const metadata: Metadata = {
  metadataBase: new URL("https://mamp.pages.dev"),
  title: {
    default: "منصة مامب — إدارة الجمعيات المغربية",
    template: "%s | منصة مامب",
  },
  description:
    "منصة رقمية احترافية لإدارة الجمعيات المغربية: الانخراطات، المحاسبة، التبرعات، الفعاليات والوثائق الرسمية — وفق القانون 75.00 والظهير الشريف 1.58.376.",
  keywords: [
    "الجمعيات المغربية",
    "إدارة الجمعيات",
    "القانون 75.00",
    "محاسبة الجمعيات",
    "الانخراط",
    "التبرعات",
    "المساعد الجمعوي",
    "MAMP",
  ],
  authors: [{ name: "منصة مامب" }],
  creator: "TARIK CHOUIKA",
  publisher: "منصة مامب",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  applicationName: "منصة مامب",
  appleWebApp: {
    capable: true,
    title: "منصة مامب",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ar_MA",
    url: "/",
    siteName: "منصة مامب",
    title: "منصة مامب — إدارة الجمعيات المغربية",
    description:
      "رقمنة إدارة ومحاسبة وعمل الجمعيات المغربية بشكل احترافي وآمن ومتوافق مع القوانين — مع مساعد جمعوي بدون هلوسة.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "منصة مامب — إدارة الجمعيات المغربية",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة مامب — إدارة الجمعيات المغربية",
    description:
      "رقمنة إدارة ومحاسبة الجمعيات المغربية — وفق القانون 75.00 وبحماية المعطيات وفق القانون 09.08.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "government",
};

export const viewport: Viewport = {
  themeColor: "#0d6b4f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
        <Toaster />
        <ChatbotWidget />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";

export const metadata: Metadata = {
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
  openGraph: {
    title: "منصة مامب — إدارة الجمعيات المغربية",
    description:
      "رقمنة إدارة ومحاسبة وعمل الجمعيات المغربية بشكل احترافي وآمن ومتوافق مع القوانين.",
    siteName: "منصة مامب",
    type: "website",
    locale: "ar_MA",
  },
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

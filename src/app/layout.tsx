import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { LanguageProvider } from "@/context/LanguageProvider";
import { Toaster } from "react-hot-toast";

// ২. ইন্টার ফন্টটি কম্পোনেন্টের বাইরে এভাবে ডিফাইন করো
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Methqal Tech | منصة مثقال تك لإدارة المدارس",
  description: "مثقال تك — منصة مدرسية عربية متكاملة لإدارة المدارس والطلاب والمعلمين وأولياء الأمور.",
  icons: { icon: "/brand/methqal-tech-mark.jpg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
     <head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            var lang = localStorage.getItem('methqal-language');
            if (lang === 'ar') {
              document.documentElement.lang = 'ar';
              document.documentElement.dir = 'rtl';
              document.documentElement.setAttribute('data-language', 'ar');
            } else {
              document.documentElement.lang = 'en';
              document.documentElement.dir = 'ltr';
              document.documentElement.setAttribute('data-language', 'en');
            }

            var theme = localStorage.getItem('theme');
            var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
            if (!theme && supportDarkMode) theme = 'dark';
            if (!theme) theme = 'light';
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}
        })();
      `,
    }}
  />
</head>

      <body 
        className={`${inter.className} antialiased flex flex-col min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-secondary)]`} suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <LanguageProvider>
          <SmoothScroll>
            <AuthProvider>

              <main className="flex-grow bg-[var(--color-bg-page)] transition-colors duration-300">
                {children}
              </main>
            </AuthProvider>
            <Toaster position="top-right" />
          </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

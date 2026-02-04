import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../lib/context/AuthContext'
import { LanguageProvider } from '../lib/context/LanguageContext'
import ToastProvider from '../components/ToastProvider'
import Script from 'next/script'

export const metadata = {
  title: 'Sportlin - Elevate Your Game',
  description: 'Connect with elite coaches, track your progress, and discover sports venues near you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                <Navbar />
                <main className="pt-16">
                  {children}
                </main>
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Script src="https://cdn.lordicon.com/lordicon.js"></Script>
      </body>
    </html>
  )
}


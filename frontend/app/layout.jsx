import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../lib/context/AuthContext'
import ToastProvider from '../components/ToastProvider'

export const metadata = {
  title: 'Sportlin - Elevate Your Game',
  description: 'Connect with elite coaches, track your progress, and discover sports venues near you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


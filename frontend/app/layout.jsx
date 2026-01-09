import './globals.css'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../lib/context/AuthContext'
import ToastProvider from '../components/ToastProvider'

export const metadata = {
  title: 'ATHLETIX - Elevate Your Game',
  description: 'Connect with elite coaches, track your progress, and discover sports venues near you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#fafbff] min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


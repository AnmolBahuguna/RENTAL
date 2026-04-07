import React from 'react'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { AuthModal } from '../auth/AuthModal'
import { Toaster } from 'react-hot-toast'

export const Layout = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#0c80ee', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <AuthModal />
    </>
  )
}

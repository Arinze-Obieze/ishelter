import Footer from "@/components/Dashboard/Footer";
import "./globals.css";
import { Montserrat } from "next/font/google"
import { InvitationsProvider } from "@/components/InvitationsContext";
import ToastProvider from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";


const montserrat = Montserrat({
  subsets: ["latin"],   
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat", 
})

export const metadata = {
  title: "iShelter",
  description: "Manage Your Construction Project, Anywhere in the World",
  manifest: "/manifest.json",       
  themeColor: "#1F2937",            
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F2937" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <ToastProvider position="top-right" />
          <InvitationsProvider>
            {children}
          </InvitationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
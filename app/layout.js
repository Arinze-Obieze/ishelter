import "./globals.css";
import { Montserrat } from "next/font/google"
import { InvitationsProvider } from "@/components/InvitationsContext";
import ToastProvider from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CsrfProvider } from "@/contexts/CsrfContext";

const montserrat = Montserrat({
  subsets: ["latin"],   
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat", 
})

export const metadata = {
  title: "iShelter",
  description: "Manage Your Construction Project, Anywhere in the World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F2937" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <CsrfProvider>
            <ToastProvider position="top-right" />
            <InvitationsProvider>
              {children}
            </InvitationsProvider>
          </CsrfProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
import "./globals.css";
import { Montserrat } from "next/font/google"



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
      <body
        className={`${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

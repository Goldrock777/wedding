import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Knot & Co — Wedding vendors that bid for your day",
  description:
    "A wedding marketplace for South Asian, East Asian, traditional Canadian and multicultural couples. Post your wedding, get bids from vetted vendors, build the team you love.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <Header />
        <main className="pb-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

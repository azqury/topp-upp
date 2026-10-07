import { Rajdhani, Inter } from 'next/font/google';
import Nav from './Nav';
import Footer from './Footer';
import './globals.css';

const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

export const metadata = { title: 'TopUp Store' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${rajdhani.variable} ${inter.variable}`}>
      <body>
        <div className="aurora"><span className="b1" /><span className="b2" /><span className="b3" /></div>
        <Nav />
        <div className="container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

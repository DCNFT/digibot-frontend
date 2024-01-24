import moment from 'moment';
import { Providers } from './Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'moment/locale/ko';
import './globals.css';
import '../styles/index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/custom-toast.css';

moment.locale('ko');
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XD-BOT',
  description: 'XD-BOT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        id="root"
        style={{ fontFamily: 'Sofia Pro, Noto Sans KR' }}
      >
        <Providers defaultTheme="white" attribute="class">
          <ToastContainer />
          <main className="flex flex-col min-h-screen  md:px-8 lg:px-12 xl:px-16 mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

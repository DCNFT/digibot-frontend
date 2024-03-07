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
import '@/styles/style.css';
import AppBar from '@/components/Appbar';

moment.locale('ko');
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XD-BOT',
  description: 'XD-BOT',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
          <div>
            <AppBar />
            {children}
          </div>
          {/* <main className="bg-background text-foreground flex h-screen flex-col items-center"> */}

          {/* </main> */}
        </Providers>
      </body>
    </html>
  );
}

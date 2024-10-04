import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'All-in-One Finder',
  description: 'Find contact information using Datagma API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
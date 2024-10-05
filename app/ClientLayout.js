'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Search' },
    { href: '/saved-results', label: 'Saved Results' },
    { href: '/file-upload', label: 'File Upload' },
    { href: '/my-files', label: 'My Files' },
  ];

  return (
    <div className="flex h-screen">
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Contact Finder</h1>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`block py-2 px-4 rounded transition duration-150 ease-in-out ${
                      pathname === item.href
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
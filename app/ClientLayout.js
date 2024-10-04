'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ClientLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Contact Finder</h1>
          <nav>
            <ul className="space-y-2">
              <li><Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-150 ease-in-out">Search</Link></li>
              <li><Link href="/saved-results" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-150 ease-in-out">Saved Results</Link></li>
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
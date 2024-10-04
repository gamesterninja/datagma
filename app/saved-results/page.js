'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SavedResults() {
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('savedResults') || '[]');
    setSavedResults(results);
  }, []);

  const handleDelete = (index) => {
    const updatedResults = savedResults.filter((_, i) => i !== index);
    setSavedResults(updatedResults);
    localStorage.setItem('savedResults', JSON.stringify(updatedResults));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Saved Results</h2>
      {savedResults.length === 0 ? (
        <p className="text-gray-600">No saved results yet.</p>
      ) : (
        savedResults.map((result, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-lg rounded-lg p-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Result {index + 1}</h3>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </motion.div>
        ))
      )}
    </div>
  );
}
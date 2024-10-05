'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function ProcessedFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(sessionStorage.getItem('processedFiles') || '[]');
    setFiles(storedFiles);
  }, []);

  const handleDownload = (fileId, format) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (format === 'csv') {
      downloadCSV(file);
    } else if (format === 'xlsx') {
      downloadExcel(file);
    }
  };

  const downloadCSV = (file) => {
    const csvContent = [
      ['Name', 'Company', 'Original Email', 'Enriched Email', 'LinkedIn', 'Phone', 'WhatsApp'],
      ...file.data.map(row => [
        row.name,
        row.company,
        row.email,
        row.enriched_email,
        row.linkedin,
        row.phone,
        row.whatsapp
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${file.name}_enriched.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadExcel = (file) => {
    const worksheet = XLSX.utils.json_to_sheet(file.data.map(row => ({
      Name: row.name,
      Company: row.company,
      'Original Email': row.email,
      'Enriched Email': row.enriched_email,
      LinkedIn: row.linkedin,
      Phone: row.phone,
      WhatsApp: row.whatsapp,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enriched Data');
    XLSX.writeFile(workbook, `${file.name}_enriched.xlsx`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Processed Files</h1>
      {files.length === 0 ? (
        <p className="text-gray-600">No files processed yet.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {file.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploadDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownload(file.id, 'csv')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Download CSV
                    </button>
                    <button
                      onClick={() => handleDownload(file.id, 'xlsx')}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Download Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
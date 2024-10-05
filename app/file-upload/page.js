'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileHeaders = await readFileHeaders(selectedFile);
      setHeaders(fileHeaders);

      const autoMapping = {
        name: fileHeaders.find(h => h.toLowerCase().includes('name')) || '',
        company: fileHeaders.find(h => h.toLowerCase().includes('company')) || '',
        email: fileHeaders.find(h => h.toLowerCase().includes('email')) || '',
        linkedin: fileHeaders.find(h => h.toLowerCase().includes('linkedin') || h.toLowerCase().includes('url')) || '',
      };
      setMapping(autoMapping);
    }
  };

  const readFileHeaders = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = jsonData[0];
        resolve(headers);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleMappingChange = (e) => {
    setMapping({ ...mapping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !mapping.name || !mapping.company) {
      alert('Please select a file and map the Name and Company fields.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const data = await readFileData(file);
      const processedData = await processAndEnrichData(data);

      // Store processed data in sessionStorage
      const existingFiles = JSON.parse(sessionStorage.getItem('processedFiles') || '[]');
      const newFile = {
        id: Date.now(),
        name: file.name,
        data: processedData,
        uploadDate: new Date().toISOString(),
      };
      existingFiles.push(newFile);
      sessionStorage.setItem('processedFiles', JSON.stringify(existingFiles));

      router.push('/my-files');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('File processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const readFileData = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Remove header row and convert to object array
        const headers = jsonData[0];
        const rows = jsonData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        resolve(rows);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processAndEnrichData = async (data) => {
    const enrichedData = [];
    const totalRows = data.length;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const contactInfo = {
        name: row[mapping.name],
        company: row[mapping.company],
        email: mapping.email ? row[mapping.email] : '',
        linkedin: mapping.linkedin ? row[mapping.linkedin] : '',
      };

      // Make API call to enrich data
      try {
        const enrichedInfo = await enrichContact(contactInfo);
        const enrichedRow = {
          ...contactInfo,
          enriched_email: enrichedInfo.email || '',
          phone: enrichedInfo.phone || '',
          whatsapp: enrichedInfo.whatsapp ? 'Yes' : 'No',
          // Add any other enriched fields here
        };
        enrichedData.push(enrichedRow);
      } catch (error) {
        console.error('Error enriching contact:', error);
        // If enrichment fails, add the original data
        enrichedData.push({
          ...contactInfo,
          enriched_email: '',
          phone: '',
          whatsapp: '',
        });
      }

      setProgress(Math.round(((i + 1) / totalRows) * 100));
    }

    return enrichedData;
  };

  const enrichContact = async (contact) => {
    // Replace this with your actual API call to Datagma
    const apiUrl = 'https://gateway.datagma.net/api/ingress/v2/full';
    const apiId = process.env.NEXT_PUBLIC_DATAGMA_API_ID;

    const params = new URLSearchParams({
      apiId: apiId,
      fullName: contact.name,
      data: contact.company,
      phoneFull: 'true',
      companyFull: 'true',
      personFull: 'true',
      whatsappCheck: 'true',
    });

    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to enrich contact');
    }

    const data = await response.json();

    // Extract relevant information from the API response
    return {
      email: data.person?.basic?.email || data.emailFinder?.email || '',
      phone: data.phoneFull?.phones?.[0]?.displayInternational || '',
      whatsapp: data.phoneFull?.phones?.[0]?.linkedWhatsapp || false,
      // Add any other fields you want to extract from the API response
    };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">File Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Select CSV or Excel file
          </label>
          <input
            type="file"
            id="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>
        {headers.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Field Mapping</h2>
            {['name', 'company', 'email', 'linkedin'].map((field) => (
              <div key={field} className="flex items-center mb-2">
                <label htmlFor={field} className="w-1/4 text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                  {(field === 'name' || field === 'company') && <span className="text-red-500">*</span>}
                </label>
                <select
                  id={field}
                  name={field}
                  value={mapping[field] || ''}
                  onChange={handleMappingChange}
                  className="mt-1 block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required={field === 'name' || field === 'company'}
                >
                  <option value="">Select a column</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        {isProcessing && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Processing
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isProcessing || !file || !mapping.name || !mapping.company}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            (isProcessing || !file || !mapping.name || !mapping.company) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </button>
      </form>
    </div>
  );
}
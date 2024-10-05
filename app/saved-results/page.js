'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function SavedResults() {
  const [savedResults, setSavedResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('savedResults') || '[]');
    const uniqueResults = results.reduce((acc, result) => {
      if (!result.timestamp) {
        result.timestamp = new Date().toISOString();
      }
      const key = `${result.person?.basic?.name}-${result.person?.basic?.company}`;
      acc[key] = result;
      return acc;
    }, {});
    setSavedResults(Object.values(uniqueResults));
  }, []);

  const handleShowDetails = (result) => {
    setSelectedResult(selectedResult === result ? null : result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Saved Results</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          {['Card View', 'Table View'].map((view) => (
            <Tab
              key={view}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              {view}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">{result.person?.basic?.name || 'N/A'}</h2>
                    <p className="text-sm text-gray-600">{result.person?.data?.position || 'N/A'}</p>
                  </div>
                  <div className="px-6 py-4 space-y-2">
                    <p><span className="font-medium">Company:</span> {result.person?.basic?.company || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {result.emailFinder?.email || result.person?.basic?.email || 'N/A'}</p>
                    <p><span className="font-medium">LinkedIn:</span> {result.person?.basic?.linkedInUrl ? <a href={result.person?.basic?.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.person?.basic?.linkedInUrl}</a> : 'N/A'}</p>
                    <p><span className="font-medium">Location:</span> {result.person?.basic?.location || 'N/A'}</p>
                    <p><span className="font-medium">Saved on:</span> {new Date(result.timestamp).toLocaleString()}</p>
                    <button
                      onClick={() => handleShowDetails(result)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out w-full"
                    >
                      {selectedResult === result ? 'Hide Details' : 'Show Details'}
                    </button>
                    {selectedResult === result && (
                      <div className="mt-4 space-y-4">
                        {result.phoneFull && result.phoneFull.phones && result.phoneFull.phones.length > 0 && (
                          <div>
                            <h4 className="font-medium text-lg mb-2">Phone Numbers:</h4>
                            {result.phoneFull.phones.map((phone, phoneIndex) => (
                              <p key={phoneIndex} className="ml-4">
                                <span className="capitalize">{phone.type}:</span> {phone.displayInternational} 
                                {phone.linkedWhatsapp && <span className="ml-2 text-green-600 font-medium">(WhatsApp)</span>}
                              </p>
                            ))}
                          </div>
                        )}
                        {result.company && result.company.full && (
                          <div>
                            <h4 className="font-medium text-lg mb-2">Company Information:</h4>
                            <p className="ml-4"><span className="font-medium">Description:</span> {result.company.full.properties.shortDescription || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Website:</span> {result.company.full.cards.overviewFields2.website?.value || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Total Funding:</span> {result.company.full.cards.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Employee Count:</span> {result.company.full.cards.overviewFields?.numEmployee || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Founded:</span> {result.company.full.cards.overviewFields?.foundedOn || 'N/A'}</p>
                          </div>
                        )}
                        {result.emailFinder && (
                          <div>
                            <h4 className="font-medium text-lg mb-2">Email Finder Results:</h4>
                            <p className="ml-4"><span className="font-medium">Email:</span> {result.emailFinder.email || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Status:</span> {result.emailFinder.status || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Type:</span> {result.emailFinder.type || 'N/A'}</p>
                            <p className="ml-4"><span className="font-medium">Confidence Score:</span> {result.emailFinder.confidenceScore || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <p className="mb-4 text-sm text-gray-600">Scroll horizontally to view all information</p>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Company', 'Email', 'LinkedIn', 'Location', 'Position', 'Phone', 'Company Description', 'Website', 'Total Funding', 'Employee Count', 'Founded', 'Email Status', 'Confidence', 'Saved Date'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{result.person?.basic?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.person?.basic?.company || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.emailFinder?.email || result.person?.basic?.email || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.person?.basic?.linkedInUrl || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.person?.basic?.location || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.person?.data?.position || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.phoneFull?.phones?.[0]?.displayInternational || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.company?.full?.properties?.shortDescription || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.company?.full?.cards?.overviewFields2?.website?.value || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.company?.full?.cards?.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.company?.full?.cards?.overviewFields?.numEmployee || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.company?.full?.cards?.overviewFields?.foundedOn || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.emailFinder?.status || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.emailFinder?.confidenceScore || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(result.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
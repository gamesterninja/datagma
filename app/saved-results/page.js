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
      <h1 className="text-2xl font-bold mb-4">Saved Results</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Card View
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Table View
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">{result.person?.basic?.name || 'N/A'}</h2>
                  </div>
                  <div className="px-6 py-4">
                    <p><span className="font-medium">Company:</span> {result.person?.basic?.company || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {result.person?.basic?.email || 'N/A'}</p>
                    <p><span className="font-medium">LinkedIn:</span> {result.person?.basic?.linkedInUrl ? <a href={result.person?.basic?.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.person?.basic?.linkedInUrl}</a> : 'N/A'}</p>
                    <p><span className="font-medium">Location:</span> {result.person?.basic?.location || 'N/A'}</p>
                    <p><span className="font-medium">Position:</span> {result.person?.data?.position || 'N/A'}</p>
                    <p><span className="font-medium">Saved on:</span> {new Date(result.timestamp).toLocaleString()}</p>
                    <button
                      onClick={() => handleShowDetails(result)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                    >
                      {selectedResult === result ? 'Hide Details' : 'Show Details'}
                    </button>
                    {selectedResult === result && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
                        {result.phoneFull && result.phoneFull.phones && result.phoneFull.phones.length > 0 && (
                          <div>
                            <h4 className="font-medium">Phone Numbers:</h4>
                            {result.phoneFull.phones.map((phone, phoneIndex) => (
                              <p key={phoneIndex}>
                                <span className="capitalize">{phone.type}:</span> {phone.displayInternational} 
                                {phone.linkedWhatsapp && <span className="ml-2 text-green-600 font-medium">(WhatsApp)</span>}
                              </p>
                            ))}
                          </div>
                        )}
                        {result.company && result.company.full && (
                          <div className="mt-2">
                            <h4 className="font-medium">Company Information:</h4>
                            <p>Description: {result.company.full.properties.shortDescription || 'N/A'}</p>
                            <p>Website: {result.company.full.cards.overviewFields2.website?.value || 'N/A'}</p>
                            <p>Total Funding: {result.company.full.cards.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</p>
                            <p>Employee Count: {result.company.full.cards.overviewFields?.numEmployee || 'N/A'}</p>
                            <p>Founded: {result.company.full.cards.overviewFields?.foundedOn || 'N/A'}</p>
                          </div>
                        )}
                        {result.emailFinder && (
                          <div className="mt-2">
                            <h4 className="font-medium">Email Finder Results:</h4>
                            <p>Email: {result.emailFinder.email || 'N/A'}</p>
                            <p>Status: {result.emailFinder.status || 'N/A'}</p>
                            <p>Type: {result.emailFinder.type || 'N/A'}</p>
                            <p>Confidence Score: {result.emailFinder.confidenceScore || 'N/A'}</p>
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
            <p className="mb-2 text-sm text-gray-600">Scroll horizontally to view all information</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Name</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Company</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Email</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">LinkedIn</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Location</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Position</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Phone</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">WhatsApp</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Company Description</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Website</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Total Funding</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Employee Count</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Founded</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Email Finder Status</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Email Confidence</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Saved Date</th>
                  </tr>
                </thead>
                <tbody>
                  {savedResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.basic?.name || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.basic?.company || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.basic?.email || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.basic?.linkedInUrl || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.basic?.location || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.person?.data?.position || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.phoneFull?.phones?.[0]?.displayInternational || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.phoneFull?.phones?.[0]?.linkedWhatsapp ? 'Yes' : 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.company?.full?.properties?.shortDescription || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.company?.full?.cards?.overviewFields2?.website?.value || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.company?.full?.cards?.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.company?.full?.cards?.overviewFields?.numEmployee || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.company?.full?.cards?.overviewFields?.foundedOn || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.emailFinder?.status || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{result.emailFinder?.confidenceScore || 'N/A'}</td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">{new Date(result.timestamp).toLocaleString()}</td>
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
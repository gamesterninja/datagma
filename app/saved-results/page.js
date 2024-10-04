'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/Card';

export default function SavedResults() {
  const [savedResults, setSavedResults] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('savedResults') || '[]');
    setSavedResults(results);
  }, []);

  const toggleRowExpansion = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderExpandedContent = (result) => {
    return (
      <div className="mt-4 space-y-4">
        {result.person && result.person.basic && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-gray-700">Person Information</h4>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-medium">Name:</span> {result.person.basic.name || 'N/A'}</p>
              <p><span className="font-medium">Company:</span> {result.person.basic.company || 'N/A'}</p>
              <p><span className="font-medium">LinkedIn:</span> {result.person.basic.linkedInUrl ? <a href={result.person.basic.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.person.basic.linkedInUrl}</a> : 'N/A'}</p>
              <p><span className="font-medium">Location:</span> {result.person.basic.location || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {result.person.basic.email || 'N/A'}</p>
              {result.emailFinder && result.emailFinder.email && (
                <p><span className="font-medium">Found Email:</span> {result.emailFinder.email}</p>
              )}
              {result.person.data && result.person.data.position && (
                <p><span className="font-medium">Position:</span> {result.person.data.position}</p>
              )}
            </CardContent>
          </Card>
        )}

        {result.phoneFull && result.phoneFull.phones && result.phoneFull.phones.length > 0 && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-gray-700">Phone Numbers</h4>
            </CardHeader>
            <CardContent>
              {result.phoneFull.phones.map((phone, index) => (
                <p key={index} className="mb-2">
                  <span className="font-medium capitalize">{phone.type}:</span> {phone.displayInternational} 
                  {phone.linkedWhatsapp && <span className="ml-2 text-green-600 font-medium">(WhatsApp)</span>}
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        {result.company && result.company.full && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-gray-700">Company Information</h4>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-medium">Name:</span> {result.company.full.properties.title || 'N/A'}</p>
              <p><span className="font-medium">Description:</span> {result.company.full.properties.shortDescription || 'N/A'}</p>
              <p><span className="font-medium">Website:</span> {result.company.full.cards.overviewFields2.website?.value ? <a href={result.company.full.cards.overviewFields2.website.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.company.full.cards.overviewFields2.website.value}</a> : 'N/A'}</p>
              <p><span className="font-medium">Total Funding:</span> {result.company.full.cards.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</p>
              <p><span className="font-medium">Employee Count:</span> {result.company.full.cards.overviewFields?.numEmployee || 'N/A'}</p>
              <p><span className="font-medium">Founded:</span> {result.company.full.cards.overviewFields?.foundedOn || 'N/A'}</p>
            </CardContent>
          </Card>
        )}

        {result.emailFinder && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-gray-700">Email Finder Results</h4>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-medium">Email:</span> {result.emailFinder.email || 'N/A'}</p>
              <p><span className="font-medium">Status:</span> {result.emailFinder.status || 'N/A'}</p>
              <p><span className="font-medium">Type:</span> {result.emailFinder.type || 'N/A'}</p>
              <p><span className="font-medium">Confidence Score:</span> {result.emailFinder.confidenceScore || 'N/A'}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Results</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedResults.map((result, index) => (
              <React.Fragment key={index}>
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-2 px-4 border-b">{result.person?.basic?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{result.person?.basic?.company || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => toggleRowExpansion(index)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
                    >
                      {expandedRows[index] ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </motion.tr>
                {expandedRows[index] && (
                  <tr>
                    <td colSpan="3" className="py-4 px-4 border-b">
                      {renderExpandedContent(result)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
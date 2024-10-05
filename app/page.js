'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from './components/Card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { searchGeneral, findEmail } from './api/datagmaApi';

function useDebounce(func, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    fullName: '',
    companyName: '',
    socialUrl: '',
    email: '',
    jobTitle: '',
    country: 'General',
    whatsappCheck: false,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setSearchParams(prev => ({ ...prev, whatsappCheck: e.target.checked }));
  };

  const validateForm = () => {
    if (!searchParams.fullName && !searchParams.companyName && !searchParams.socialUrl && !searchParams.email) {
      toast.error('Please fill at least one of: Full Name, Company Name, LinkedIn URL, or Email');
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      let generalData = {};
      let emailData = {};

      // General information search
      if (searchParams.fullName || searchParams.companyName || searchParams.socialUrl) {
        generalData = await searchGeneral(searchParams);
      }

      // Email finding
      if (searchParams.fullName && (searchParams.companyName || searchParams.email)) {
        emailData = await findEmail(searchParams);
      }

      // Merge results
      const mergedResults = { ...generalData, emailFinder: emailData };

      if (Object.keys(mergedResults).length === 0) {
        toast.info('No results found. Try adjusting your search criteria.');
        setResults(null);
      } else {
        setResults(mergedResults);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults(null);
      toast.error(`Failed to fetch information: ${error.message}`);
    }

    setLoading(false);
  };

  const handleSave = () => {
    if (results) {
      const savedResults = JSON.parse(localStorage.getItem('savedResults') || '[]');
      savedResults.push(results);
      localStorage.setItem('savedResults', JSON.stringify(savedResults));
      toast.success('Results saved successfully!');
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={5000} />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={searchParams.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={searchParams.companyName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Acme Inc"
            />
          </div>
          <div>
            <label htmlFor="socialUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="text"
              id="socialUrl"
              name="socialUrl"
              value={searchParams.socialUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={searchParams.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={searchParams.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Sales Manager"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={searchParams.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="General"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="whatsappCheck"
              checked={searchParams.whatsappCheck}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="whatsappCheck" className="ml-2 block text-sm text-gray-900">
              Check WhatsApp
            </label>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={debouncedSearch}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-lg font-semibold"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Search'}
        </motion.button>
      </motion.div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">Search Results</h3>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              Save Results
            </button>
          </div>

          {results.person && results.person.basic && (
            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold text-gray-700">Person Information</h4>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Name:</span> {results.person.basic.name || 'N/A'}</p>
                <p><span className="font-medium">Company:</span> {results.person.basic.company || 'N/A'}</p>
                <p><span className="font-medium">LinkedIn:</span> {results.person.basic.linkedInUrl ? <a href={results.person.basic.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{results.person.basic.linkedInUrl}</a> : 'N/A'}</p>
                <p><span className="font-medium">Location:</span> {results.person.basic.location || 'N/A'}</p>
                <p><span className="font-medium">Email:</span> {results.person.basic.email || 'N/A'}</p>
                {results.emailFinder && results.emailFinder.email && (
                  <p><span className="font-medium">Found Email:</span> {results.emailFinder.email}</p>
                )}
                {results.person.data && results.person.data.position && (
                  <p><span className="font-medium">Position:</span> {results.person.data.position}</p>
                )}
              </CardContent>
            </Card>
          )}

          {results.phoneFull && results.phoneFull.phones && results.phoneFull.phones.length > 0 && (
            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold text-gray-700">Phone Numbers</h4>
              </CardHeader>
              <CardContent>
                {results.phoneFull.phones.map((phone, index) => (
                  <p key={index} className="mb-2">
                    <span className="font-medium capitalize">{phone.type}:</span> {phone.displayInternational} 
                    {phone.linkedWhatsapp && <span className="ml-2 text-green-600 font-medium">(WhatsApp)</span>}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {results.company && results.company.full && (
            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold text-gray-700">Company Information</h4>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Name:</span> {results.company.full.properties.title || 'N/A'}</p>
                <p><span className="font-medium">Description:</span> {results.company.full.properties.shortDescription || 'N/A'}</p>
                <p><span className="font-medium">Website:</span> {results.company.full.cards.overviewFields2.website?.value ? <a href={results.company.full.cards.overviewFields2.website.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{results.company.full.cards.overviewFields2.website.value}</a> : 'N/A'}</p>
                <p><span className="font-medium">Total Funding:</span> {results.company.full.cards.fundingRoundsSummary?.fundingTotal?.valueUsdRoundup || 'N/A'}</p>
                <p><span className="font-medium">Employee Count:</span> {results.company.full.cards.overviewFields?.numEmployee || 'N/A'}</p>
                <p><span className="font-medium">Founded:</span> {results.company.full.cards.overviewFields?.foundedOn || 'N/A'}</p>
              </CardContent>
            </Card>
          )}

          {results.emailFinder && (
            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold text-gray-700">Email Finder Results</h4>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Email:</span> {results.emailFinder.email || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {results.emailFinder.status || 'N/A'}</p>
                <p><span className="font-medium">Type:</span> {results.emailFinder.type || 'N/A'}</p>
                <p><span className="font-medium">Confidence Score:</span> {results.emailFinder.confidenceScore || 'N/A'}</p>
              </CardContent>
            </Card>
          )}

          {results.creditBurn && (
            <p className="text-sm text-gray-500 mt-4">Credits used: {results.creditBurn}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
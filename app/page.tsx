'use client';

import { useState } from 'react';

interface FAQ {
  id: string;
  title: string;
  body: string;
}

interface SearchResponse {
  results: FAQ[];
  summary?: string;
  sources?: string[];
  message?: string;
  error?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FAQ[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [emptyMessage, setEmptyMessage] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setEmptyMessage('');
    setResults([]);
    setSummary('');
    setSources([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data: SearchResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred while searching');
        return;
      }

      setResults(data.results || []);
      setSummary(data.summary || '');
      setSources(data.sources || []);
      
      if (data.message) {
        setEmptyMessage(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the search service');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            FAQ Search
          </h1>
          <p className="text-lg text-gray-600">
            Search for Keywords
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-10 pr-4 py-3 text-gray-900 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-500">Searching...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {emptyMessage && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md text-center">
            <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-yellow-800 font-medium">{emptyMessage}</p>
            <p className="text-yellow-700 text-sm mt-1">Try using different keywords</p>
          </div>
        )}

        {/* Summary */}
        {summary && !loading && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-md mb-6">
            <h3 className="text-indigo-900 font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Summary
            </h3>
            <p className="text-indigo-800 text-sm leading-relaxed">{summary}</p>
            {sources.length > 0 && (
              <p className="text-indigo-600 text-xs mt-2">Sources: {sources.join(', ')}</p>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {results.length} found
              </span>
            </div>
            {results.map((result, index) => (
              <div
                key={result.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {result.title}
                  </h3>
                  <span className="flex-shrink-0 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{result.body}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">ID: {result.id}</span>
                  <span className="text-xs text-indigo-600 font-medium">FAQ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

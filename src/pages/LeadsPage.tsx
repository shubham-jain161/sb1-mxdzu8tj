import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { getGeminiModel } from '../lib/gemini';

export default function LeadsPage() {
  const [keywords, setKeywords] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const findLeads = async () => {
    setLoading(true);
    try {
      const model = getGeminiModel();
      // Implementation of lead finding logic using Gemini
      setLoading(false);
    } catch (error) {
      console.error('Error finding leads:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Lead Generation</h1>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter keywords to find leads..."
              className="w-full p-2 border rounded"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            onClick={findLeads}
            disabled={loading}
          >
            <Search className="mr-2" />
            {loading ? 'Searching...' : 'Find Leads'}
          </button>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <Filter className="mr-2" />
            Filters
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <Download className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} className="border-b">
                <td className="px-6 py-4">{lead.name}</td>
                <td className="px-6 py-4">{lead.company}</td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">{lead.status}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    Add to Campaign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import { emailClient } from '../lib/azure-email';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Email Campaigns</h1>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Campaign Name</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Leads</th>
              <th className="px-6 py-3 text-left">Open Rate</th>
              <th className="px-6 py-3 text-left">Response Rate</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign: any) => (
              <tr key={campaign.id} className="border-b">
                <td className="px-6 py-4">{campaign.name}</td>
                <td className="px-6 py-4">{campaign.status}</td>
                <td className="px-6 py-4">{campaign.leadsCount}</td>
                <td className="px-6 py-4">{campaign.openRate}%</td>
                <td className="px-6 py-4">{campaign.responseRate}%</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-4">
                    Edit
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    Start
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
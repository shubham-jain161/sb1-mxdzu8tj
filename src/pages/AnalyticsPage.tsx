import React from 'react';
import Stats from '../components/dashboard/Stats';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>
      
      <Stats />
      
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
          {/* Add campaign performance chart here */}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lead Conversion</h2>
          {/* Add lead conversion chart here */}
        </div>
      </div>
    </div>
  );
}
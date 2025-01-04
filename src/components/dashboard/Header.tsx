import React from 'react';
import { useAuthStore } from '../../lib/store';
import { LogOut, Settings } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Agents Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
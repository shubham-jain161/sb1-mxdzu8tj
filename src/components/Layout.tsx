import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Mail, MessageSquare, Settings, BarChart } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">AI Agents</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Link to="/leads" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <Users className="mr-2" />
              Leads
            </Link>
            <Link to="/campaigns" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <Mail className="mr-2" />
              Campaigns
            </Link>
            <Link to="/conversations" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="mr-2" />
              Conversations
            </Link>
            <Link to="/analytics" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <BarChart className="mr-2" />
              Analytics
            </Link>
            <Link to="/settings" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="mr-2" />
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
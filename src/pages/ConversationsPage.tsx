import React, { useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import type { Conversation } from '../types/agents';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Conversations</h1>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="mt-1">Conversations will appear here once leads respond to your campaigns</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{conversation.leadId}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {conversation.messages[conversation.messages.length - 1].content}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(conversation.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
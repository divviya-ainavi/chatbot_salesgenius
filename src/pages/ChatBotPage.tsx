import React from 'react';
import ChatBot from '../components/ChatBot';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const ChatBotPage: React.FC = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          {user?.email}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
      <ChatBot />
    </div>
  );
};

export default ChatBotPage;

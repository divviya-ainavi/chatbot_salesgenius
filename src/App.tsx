import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatBotPage from './pages/ChatBotPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type Page = 'login' | 'signup' | 'chatbot';

const AuthenticatedApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');

  useEffect(() => {
    if (user) {
      setCurrentPage('chatbot');
    } else {
      if (currentPage === 'chatbot') {
        setCurrentPage('login');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'signup') {
      return <SignUpPage onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    return <LoginPage onNavigateToSignUp={() => setCurrentPage('signup')} />;
  }

  return <ChatBotPage />;
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
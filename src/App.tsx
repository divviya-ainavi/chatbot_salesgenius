import React, { useState } from "react";
import ChatBot from "./components/ChatBot";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LogOut, Loader2 } from "lucide-react";

const AuthenticatedApp: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

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
    return showSignUp ? (
      <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
    ) : (
      <Login onSwitchToSignUp={() => setShowSignUp(true)} />
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        {profile && (
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50">
            <p className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-semibold text-gray-800">
                {profile.username.charAt(0).toUpperCase() +
                  profile.username.slice(1)}
              </span>
            </p>
          </div>
        )}
        <button
          onClick={signOut}
          className="bg-white/90 backdrop-blur-sm hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-xl shadow-lg border border-white/50 transition-all duration-300 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
      <ChatBot />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;

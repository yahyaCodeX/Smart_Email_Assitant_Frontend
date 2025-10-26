import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/email/generate';

const EmailReplier = () => {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'formal', label: 'Formal', icon: '🎩' },
    { value: 'casual', label: 'Casual', icon: '👕' },
    { value: 'urgent', label: 'Urgent', icon: '⚡' }
  ];

  const handleGenerateReply = async () => {
    setMessage('');
    setGeneratedReply('');
    if (!emailContent.trim()) {
      setMessage('Please enter the original email content.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent, tone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email. Server error.');
      }

      const replyText = await response.text();
      setGeneratedReply(replyText);
      setMessage('Email reply generated successfully!');

    } catch (error) {
      console.error('API Error:', error);
      setMessage(`Error: ${error.message}. Make sure your backend is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply)
        .then(() => {
          setMessage('Reply copied to clipboard! ✅');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          setMessage('Failed to copy to clipboard.');
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-4xl bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-8 border border-gray-700/50">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Email Assistant
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Craft perfect email replies with AI-powered assistance</p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-200 flex items-center space-x-2">
                <span>📧</span>
                <span>Original Email Content</span>
              </label>
              <div className="relative group">
                <textarea
                  className="w-full h-48 p-4 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none group-hover:border-gray-600 backdrop-blur-sm"
                  placeholder="Paste the email you need to reply to here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-200">
                Select Tone
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {tones.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    disabled={isLoading}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      tone === value
                        ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25'
                        : 'border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800/60'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-center space-y-1">
                      <div className="text-xl">{icon}</div>
                      <div className="text-sm font-medium">{label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Generate Reply</h3>
              
              <button
                onClick={handleGenerateReply}
                disabled={isLoading || !emailContent.trim()}
                className={`w-full py-4 px-6 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isLoading || !emailContent.trim()
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Generate Reply</span>
                    </>
                  )}
                </div>
              </button>

              {/* Stats or Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <div className="flex justify-between items-center">
                  <span>Current Tone:</span>
                  <span className="text-blue-400 font-medium capitalize">{tone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Content Length:</span>
                  <span className={emailContent.length > 0 ? 'text-green-400' : 'text-gray-500'}>
                    {emailContent.length} chars
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Reply Section */}
        {generatedReply && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-200 flex items-center space-x-2">
                <span>✨</span>
                <span>Generated Email Reply</span>
              </h2>
              <button
                onClick={handleCopy}
                disabled={!generatedReply}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Copy to Clipboard</span>
              </button>
            </div>
            
            <div className="relative group">
              <textarea
                className="w-full h-64 p-6 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none backdrop-blur-sm leading-relaxed"
                readOnly
                value={generatedReply}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* Message/Alert */}
        {message && (
          <div className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 animate-fade-in ${
            message.startsWith('Error') 
              ? 'bg-red-900/20 border-red-500/30 text-red-300' 
              : 'bg-green-900/20 border-green-500/30 text-green-300'
          }`}>
            <div className="flex items-center justify-center space-x-2 font-medium">
              {message.startsWith('Error') ? '❌' : '✅'}
              <span>{message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default EmailReplier;
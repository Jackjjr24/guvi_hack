import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [supportedLanguages] = useState([
    'English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी'
  ]);

  const formatCommand = (command: string) => {
    return command.charAt(0).toUpperCase() + command.slice(1).toLowerCase();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setLastCommand('Turn on living room lights');
      }, 1500);
    } else {
      setIsListening(true);
      setLastCommand(null);
    }
  };

  const sampleCommands = [
    { english: "Turn on the living room lights", hindi: "लिविंग रूम की लाइट चालू करो" },
    { english: "Set AC temperature to 22 degrees", hindi: "एसी का तापमान 22 डिग्री कर दो" },
    { english: "Activate night mode", hindi: "नाइट मोड चालू करो" },
    { english: "Show energy usage report", hindi: "ऊर्जा उपयोग रिपोर्ट दिखाओ" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Voice Assistant Button */}
      <button
        onClick={handleVoiceToggle}
        className={`relative w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700' 
            : isProcessing
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto">
          </div>
        ) : isListening ? (
          <MicOff className="w-6 h-6 text-white mx-auto" />
        ) : (
          <Mic className="w-6 h-6 text-white mx-auto" />
        )}
        
        {/* Simple listening indicator */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping"></div>
        )}
      </button>

      {/* Voice Assistant Panel */}
      {(isListening || isProcessing || lastCommand) && (
        <div className="absolute bottom-16 right-0 w-80 bg-white border border-primary-200 shadow-lg rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-primary-900">Voice Assistant</h3>
          </div>

          {isListening && (
            <div className="text-center py-3">
              <div className="text-blue-600 font-medium mb-2">Listening...</div>
              <div className="text-sm text-primary-600 mb-3">Speak your command in any supported language</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {supportedLanguages.map((lang, index) => (
                  <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-3">
              <div className="text-yellow-600 font-medium mb-2">Processing...</div>
              <div className="text-sm text-primary-600">Understanding your request</div>
            </div>
          )}

          {lastCommand && (
            <div className="py-3">
              <div className="text-green-600 font-medium mb-2">Command executed:</div>
              <div className="text-primary-900 bg-primary-50 p-2 rounded border border-primary-200 text-sm">
                "{formatCommand(lastCommand)}"
              </div>
              <button
                onClick={() => setLastCommand(null)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {!isListening && !isProcessing && !lastCommand && (
            <div>
              <div className="text-sm text-primary-600 font-medium mb-2">Try these commands:</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sampleCommands.slice(0, 3).map((cmd, index) => (
                  <div key={index} className="text-xs bg-primary-50 p-2 rounded border border-primary-200">
                    <div className="text-primary-900 font-medium">"{cmd.english}"</div>
                    <div className="text-primary-600 mt-1">"{cmd.hindi}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
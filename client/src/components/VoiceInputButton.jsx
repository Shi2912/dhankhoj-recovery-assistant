import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, AlertCircle } from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported, SUPPORTED_LANGUAGES } from '../utils/speechRecognition';

export default function VoiceInputButton({ onTranscript, onRecordingChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);

  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleToggle = () => {
    setErrorMsg('');
    if (!supported) {
      setErrorMsg('Voice input is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      if (onRecordingChange) onRecordingChange(false);
    } else {
      const recognizer = createSpeechRecognizer({
        lang: selectedLang,
        onStart: () => {
          setIsRecording(true);
          if (onRecordingChange) onRecordingChange(true);
        },
        onResult: (text) => {
          if (onTranscript) {
            onTranscript(text);
          }
        },
        onError: (err) => {
          setErrorMsg(err);
          setIsRecording(false);
          if (onRecordingChange) onRecordingChange(false);
        },
        onEnd: () => {
          setIsRecording(false);
          if (onRecordingChange) onRecordingChange(false);
        }
      });

      if (recognizer) {
        recognitionRef.current = recognizer;
        try {
          recognizer.start();
        } catch (err) {
          setErrorMsg('Could not start microphone.');
          setIsRecording(false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-rose-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
          title={isRecording ? 'Click to stop recording' : 'Speak in your language'}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4 animate-bounce" />
              <span>Listening... (Click to stop)</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-saffron-600" />
              <span>Speak in your language</span>
            </>
          )}
        </button>

        {/* Language selector */}
        <div className="relative inline-flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isRecording}
            className="pl-7 pr-3 py-1.5 bg-white border border-slate-300 text-xs rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-saffron-500 focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-200">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
}

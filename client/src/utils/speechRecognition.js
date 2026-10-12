/**
 * Browser Web Speech API Recognition Wrapper
 * Supports English (India), Hindi, and Tamil
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
];

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

export function createSpeechRecognizer({ lang = 'en-IN', onResult, onError, onEnd, onStart }) {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error event:', event.error);
    if (onError) {
      let friendlyMsg = 'Microphone could not capture voice clearly. You can type instead.';
      if (event.error === 'not-allowed') {
        friendlyMsg = 'Microphone permission was denied. Please allow microphone access or type your query.';
      } else if (event.error === 'no-speech') {
        friendlyMsg = 'No speech detected. Please try speaking again or type.';
      }
      onError(friendlyMsg);
    }
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}

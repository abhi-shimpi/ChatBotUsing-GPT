import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechRecognitionComponent = ({onTranscriptChange,onListeningChange}) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

      React.useEffect(() => {
        onTranscriptChange(transcript, listening);
        onListeningChange(listening);
      }, [transcript, listening, onTranscriptChange, onListeningChange]);
      
      return (
        <div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
          <button onClick={SpeechRecognition.startListening}>Start</button>
          <button onClick={SpeechRecognition.stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
        </div>
      );
};

export default SpeechRecognitionComponent;

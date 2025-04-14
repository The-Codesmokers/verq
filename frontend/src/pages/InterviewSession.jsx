import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ServiceNode = ({ service, status, isActive }) => (
  <motion.div
    className={`p-4 rounded-lg border ${
      isActive
        ? 'bg-indigo-500/20 border-indigo-500/50'
        : status === 'completed'
        ? 'bg-green-500/20 border-green-500/50'
        : 'bg-gray-500/20 border-gray-500/50'
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${
        isActive
          ? 'bg-indigo-500 animate-pulse'
          : status === 'completed'
          ? 'bg-green-500'
          : 'bg-gray-500'
      }`} />
      <div>
        <h3 className="font-semibold text-white">{service}</h3>
        <p className="text-sm text-gray-400">
          {isActive ? 'Processing...' : status === 'completed' ? 'Completed' : 'Pending'}
        </p>
      </div>
    </div>
  </motion.div>
);

function InterviewSession() {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [serviceStatus, setServiceStatus] = useState({
    pdfExtraction: 'pending',
    geminiQuestion: 'pending',
    textToSpeech: 'pending',
    speechToText: 'pending',
    geminiEvaluation: 'pending'
  });
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        // Try to get interviewId from localStorage
        const savedInterview = localStorage.getItem('currentInterview');
        if (savedInterview) {
          const { id, question } = JSON.parse(savedInterview);
          if (id) {
            try {
              setActiveService('pdfExtraction');
              setServiceStatus(prev => ({ ...prev, pdfExtraction: 'in_progress' }));

              const { data } = await api.get(`/interview/${id}`);
              setInterview(data);
              setCurrentQuestion(question || data.questions?.[data.questions.length - 1]?.question || null);
              
              setServiceStatus(prev => ({ ...prev, pdfExtraction: 'completed' }));
              setActiveService(null);
              setIsLoading(false);
              return;
            } catch (err) {
              console.error('Error fetching saved interview:', err);
              localStorage.removeItem('currentInterview');
            }
          }
        }
        setError('No interview ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setActiveService('pdfExtraction');
        setServiceStatus(prev => ({ ...prev, pdfExtraction: 'in_progress' }));

        const { data } = await api.get(`/interview/${interviewId}`);
        setInterview(data);
        setCurrentQuestion(data.questions?.[data.questions.length - 1]?.question || null);
        
        setServiceStatus(prev => ({ ...prev, pdfExtraction: 'completed' }));
        setActiveService(null);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await submitAnswer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitAnswer = async (audioBlob) => {
    try {
      setActiveService('speechToText');
      setServiceStatus(prev => ({ ...prev, speechToText: 'in_progress' }));

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('currentQuestion', currentQuestion);

      setActiveService('geminiEvaluation');
      setServiceStatus(prev => ({ 
        ...prev, 
        speechToText: 'completed',
        geminiEvaluation: 'in_progress' 
      }));

      const { data } = await api.post(`/interview/${interviewId}/answer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setServiceStatus(prev => ({ 
        ...prev, 
        geminiEvaluation: 'completed',
        geminiQuestion: 'in_progress' 
      }));
      setActiveService('geminiQuestion');

      setCurrentQuestion(data.nextQuestion);
      
      // Refresh interview data to show updated questions
      const { data: updatedInterview } = await api.get(`/interview/${interviewId}`);
      setInterview(updatedInterview);

      setServiceStatus(prev => ({ ...prev, geminiQuestion: 'completed' }));
      setActiveService(null);
    } catch (err) {
      setError(err.message);
      setServiceStatus(prev => ({
        ...prev,
        speechToText: 'pending',
        geminiEvaluation: 'pending',
        geminiQuestion: 'pending'
      }));
      setActiveService(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Interview Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Interview for {interview?.jobRole}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Status: {interview?.status}
              </div>
            </div>

            {currentQuestion && (
              <motion.div 
                className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Current Question
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {currentQuestion}
                </p>

                <div className="flex justify-center">
                  {!isRecording ? (
                    <motion.button
                      onClick={startRecording}
                      className="px-6 py-3 bg-indigo-500 text-white rounded-full
                        hover:bg-indigo-600 transition-colors duration-200
                        flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Start Recording
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={stopRecording}
                      className="px-6 py-3 bg-red-500 text-white rounded-full
                        hover:bg-red-600 transition-colors duration-200
                        flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop Recording
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {interview?.questions?.map((qa, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Question {index + 1}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {qa.question}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Your Answer:
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {qa.answer}
                </p>
                {qa.evaluation && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Evaluation
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {qa.evaluation.feedback}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Section - Service Nodes */}
          <div className="space-y-4">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Service Status
              </h3>
              <div className="space-y-4">
                <ServiceNode 
                  service="PDF Processing" 
                  status={serviceStatus.pdfExtraction} 
                  isActive={activeService === 'pdfExtraction'} 
                />
                <ServiceNode 
                  service="Question Generation" 
                  status={serviceStatus.geminiQuestion} 
                  isActive={activeService === 'geminiQuestion'} 
                />
                <ServiceNode 
                  service="Text to Speech" 
                  status={serviceStatus.textToSpeech} 
                  isActive={activeService === 'textToSpeech'} 
                />
                <ServiceNode 
                  service="Speech to Text" 
                  status={serviceStatus.speechToText} 
                  isActive={activeService === 'speechToText'} 
                />
                <ServiceNode 
                  service="Answer Evaluation" 
                  status={serviceStatus.geminiEvaluation} 
                  isActive={activeService === 'geminiEvaluation'} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewSession; 
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import { speakingChallengeService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const SpeakingChallengeInterface = ({ language = 'spanish', onChallengeComplete }) => {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  // Load daily challenge
  const loadDailyChallenge = async () => {
    setLoading(true)
    try {
      const dailyChallenge = await speakingChallengeService.getDailyChallenge(language)
      setChallenge(dailyChallenge)
      
      if (dailyChallenge.isCompleted) {
        toast.info('You\'ve already completed today\'s challenge!')
      }
    } catch (error) {
      toast.error('Failed to load speaking challenge')
    } finally {
      setLoading(false)
    }
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const recorder = new MediaRecorder(stream)
      const chunks = []
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      toast.success('Recording started!')
    } catch (error) {
      toast.error('Could not access microphone. Please check permissions.')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      clearInterval(timerRef.current)
      setIsRecording(false)
      toast.success('Recording completed!')
    }
  }

  // Play recorded audio
  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Submit challenge
  const submitChallenge = async () => {
    if (!challenge || !audioBlob) return

    setLoading(true)
    try {
      await speakingChallengeService.completeChallenge(challenge.id, audioBlob)
      toast.success('Challenge completed! Great job! 🎉')
      onChallengeComplete && onChallengeComplete()
    } catch (error) {
      toast.error('Failed to submit challenge')
    } finally {
      setLoading(false)
    }
  }

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Load challenge on mount
  useEffect(() => {
    loadDailyChallenge()
  }, [language])

  if (loading && !challenge) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600">Loading today's challenge...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
          No Challenge Available
        </h3>
        <p className="text-surface-600 mb-6">
          We couldn't load today's speaking challenge. Please try again.
        </p>
        <Button onClick={loadDailyChallenge}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Challenge Completed State */}
      {challenge.isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
            Challenge Complete!
          </h3>
          <p className="text-surface-600 mb-6">
            You've already completed today's speaking challenge. Come back tomorrow for a new one!
          </p>
          <Button onClick={() => onChallengeComplete && onChallengeComplete()}>
            Return to Dashboard
          </Button>
        </motion.div>
      )}

      {/* Active Challenge */}
      {!challenge.isCompleted && (
        <div className="space-y-8">
          {/* Challenge Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <ApperIcon name="Mic" className="w-4 h-4 mr-2" />
              Daily Speaking Challenge
            </div>
            <h2 className="text-2xl font-heading font-bold text-surface-900 mb-2">
              {language.charAt(0).toUpperCase() + language.slice(1)} Practice
            </h2>
            <div className="inline-flex items-center px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded">
              {challenge.difficulty}
            </div>
          </div>

          {/* Challenge Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="MessageSquare" className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-surface-900 mb-2">Your Challenge:</h3>
                <p className="text-surface-700 leading-relaxed break-words">
                  {challenge.prompt}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recording Interface */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="text-center space-y-6">
              {/* Recording Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: isRecording ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                    ${isRecording 
                      ? 'bg-error text-white shadow-lg shadow-error/30' 
                      : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  <ApperIcon 
                    name={isRecording ? "Square" : "Mic"} 
                    className="w-8 h-8" 
                  />
                </motion.button>
                
                {/* Recording pulse animation */}
                {isRecording && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 w-20 h-20 bg-error rounded-full"
                  />
                )}
              </div>

              {/* Recording Status */}
              <div>
                {isRecording ? (
                  <div className="space-y-2">
                    <p className="text-error font-medium">Recording...</p>
                    <p className="text-xl font-mono text-surface-900">
                      {formatTime(recordingTime)}
                    </p>
                  </div>
                ) : audioBlob ? (
                  <div className="space-y-2">
                    <p className="text-success font-medium">Recording ready!</p>
                    <p className="text-sm text-surface-600">
                      Tap the record button to record again, or submit your response
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium text-surface-900">Ready to record</p>
                    <p className="text-sm text-surface-600">
                      Tap the microphone to start recording your response
                    </p>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              {audioBlob && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center space-x-4"
                >
                  <Button
                    variant="outline"
                    onClick={playRecording}
                    icon="Play"
                    disabled={isPlaying}
                  >
                    {isPlaying ? 'Playing...' : 'Listen'}
                  </Button>
                  
                  <Button
                    onClick={submitChallenge}
                    loading={loading}
                    icon="Send"
                  >
                    Submit Challenge
                  </Button>
                </motion.div>
              )}

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-info/5 border border-info/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-surface-900 mb-1">Speaking Tips:</h4>
                <ul className="text-sm text-surface-700 space-y-1">
                  <li>• Speak clearly and at a natural pace</li>
                  <li>• Don't worry about perfect pronunciation</li>
                  <li>• Try to speak for at least 30 seconds</li>
                  <li>• Practice makes perfect!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpeakingChallengeInterface
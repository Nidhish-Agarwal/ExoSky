import React, { useState, useEffect } from "react";
import IntroScreen from "./introScreen";
import Questions from "./question";
import ThankYouScreen from "./thankYou";
import ProgressLevel from "./progressBar";

const questionsData = [
  {
    question: "How do you like to explore space?",
    options: ["Simple visuals", "Detailed science", "Advanced astronomy", "Immersive experiences"],
  },
  {
    question: "Where are you on your space journey?",
    options: ["Just starting", "Some basics", "Advanced explorer", "Expert navigator"],
  },
  {
    question: "What kind of space wonders make you go wow?",
    options: ["Quick fun facts", "Deep science", "Stories & myths", "A mix of everything"],
  },
  {
    question: "Which part of the universe sparks your imagination the most?",
    options: ["Stars & constellations", "Planets & orbits", "Life in space", "Space missions"],
  },
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro, -2 = thank you
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [userSelected, setUserSelected] = useState(false); // Track if answer was actively selected

  const totalSteps = questionsData.length;

  const handleStart = () => setCurrentStep(0);

  const handleAnswer = (option) => {
    setCurrentAnswer(option);
    setAnswers(prev => ({ ...prev, [currentStep]: option }));
    setUserSelected(true); // Mark this as a user action
  };

  const handleComplete = () => {
    console.log("Onboarding completed with answers:", answers);
    if (onComplete) onComplete(answers);
  };

  // Auto-advance only when the user actively selects/changes an answer
  useEffect(() => {
    if (userSelected && currentStep >= 0 && currentStep < totalSteps) {
      const timer = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
          setCurrentAnswer(answers[currentStep + 1] || null);
        } else {
          setCurrentStep(-2); // Thank You screen
        }
        setUserSelected(false); // Reset flag after auto-advance
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userSelected, currentStep, answers, totalSteps]);

  if (currentStep === -1) return <IntroScreen onStart={handleStart} />;
  if (currentStep === -2) return <ThankYouScreen onComplete={handleComplete} />;

  return (
    <div className="relative h-screen w-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Top progress bar */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 w-3/4 max-w-md">
        <ProgressLevel
          current={currentStep}
          total={totalSteps}
          onSelect={(idx) => {
            setCurrentStep(idx);
            setCurrentAnswer(answers[idx] || null);
            setUserSelected(false); // Navigating manually does not auto-advance
          }}
        />
      </div>

      {/* Questions */}
      <Questions
        q={questionsData[currentStep]}
        selected={currentAnswer}
        onAnswer={handleAnswer}
      />
    </div>
  );
}

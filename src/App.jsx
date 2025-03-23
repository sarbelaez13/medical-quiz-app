import React, { useState, useEffect } from 'react';
import './index.css';
import data from './data';

function App() {
  const [questions] = useState(data);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
    }
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    
    const isCorrect = selectedOption === currentQuestion.respuesta_correcta;
    const newAnsweredQuestions = {
      ...answeredQuestions,
      [currentQuestionIndex]: { selected: selectedOption, isCorrect }
    };
    
    setAnsweredQuestions(newAnsweredQuestions);
    setShowAnswer(true);
    
    setStats({
      correct: isCorrect ? stats.correct + 1 : stats.correct,
      incorrect: !isCorrect ? stats.incorrect + 1 : stats.incorrect
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answeredQuestions[currentQuestionIndex - 1]?.selected || '');
      setShowAnswer(!!answeredQuestions[currentQuestionIndex - 1]);
    }
  };

  useEffect(() => {
    // Cargar el progreso del localStorage si existe
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      const { answered, statistics } = JSON.parse(savedProgress);
      setAnsweredQuestions(answered);
      setStats(statistics);
    }
  }, []);

  useEffect(() => {
    // Guardar progreso en localStorage
    if (Object.keys(answeredQuestions).length > 0) {
      localStorage.setItem('quizProgress', JSON.stringify({
        answered: answeredQuestions,
        statistics: stats
      }));
    }
  }, [answeredQuestions, stats]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Header stats={stats} total={questions.length} />
        
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length} 
          answered={Object.keys(answeredQuestions).length} 
        />
        
        <Question 
          question={currentQuestion} 
          selectedOption={selectedOption} 
          onOptionSelect={handleOptionSelect} 
          showAnswer={showAnswer}
        />
        
        {showAnswer && (
          <Answer 
            question={currentQuestion} 
            selectedOption={selectedOption} 
          />
        )}
        
        <div className="flex justify-between mt-6">
          <button 
            onClick={prevQuestion} 
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          
          {!showAnswer ? (
            <button 
              onClick={checkAnswer}
              disabled={!selectedOption}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Verificar
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ stats, total }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-center mb-2">Estudio Médico</h1>
      <div className="flex justify-center gap-4">
        <span className="text-green-600">Correctas: {stats.correct}</span>
        <span className="text-red-600">Incorrectas: {stats.incorrect}</span>
        <span>Total: {total}</span>
      </div>
    </div>
  );
}

function ProgressBar({ current, total, answered }) {
  const progress = (answered / total) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>Pregunta {current} de {total}</span>
        <span>{Math.round(progress)}% completado</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function Question({ question, selectedOption, onOptionSelect, showAnswer }) {
  if (!question) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-4">{question.pregunta}</h2>
      <div className="space-y-2">
        {question.opciones.map((option, index) => (
          <div 
            key={index}
            onClick={() => onOptionSelect(option.charAt(0))}
            className={`p-3 border rounded cursor-pointer transition ${
              selectedOption === option.charAt(0) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:bg-gray-50'
            } ${
              showAnswer && option.charAt(0) === question.respuesta_correcta
                ? 'border-green-500 bg-green-50'
                : ''
            } ${
              showAnswer && selectedOption === option.charAt(0) && selectedOption !== question.respuesta_correcta
                ? 'border-red-500 bg-red-50'
                : ''
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

function Answer({ question, selectedOption }) {
  const isCorrect = selectedOption === question.respuesta_correcta;
  
  return (
    <div className="mt-4 p-4 border rounded">
      <div className={`font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {isCorrect ? '¡Correcto!' : '¡Incorrecto!'} La respuesta correcta es: {question.respuesta_correcta}
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold mb-2">Explicación:</h3>
        <p className="text-gray-700 whitespace-pre-line">{question.argumento}</p>
      </div>
      
      {question.bibliografia && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Bibliografía:</h3>
          <p className="text-gray-700">{question.bibliografia}</p>
        </div>
      )}
    </div>
  );
}

export default App;

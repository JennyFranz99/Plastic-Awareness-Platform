import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import questions from '../data/quizQuestions.json';
import './Quiz.css';


const Alert = ({ type, children }) => (
  <div role="alert" className={`alert ${type}`}>{children}</div>
);

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const answer = data.answer;
    if (answer === questions[current].answer) {
      setScore((s) => s + 1);
      setFeedback('🎉 Correct!');   
        setTimeout(() => {
        setFeedback('');
        setCurrent((prev) => prev + 1);
        reset();
      }, 1000);
    } else {
      setFeedback('❌ Try again!');
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFeedback('');
    reset();
  };


  if (current >= questions.length) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">Quiz Complete!</h2>
        <div className="quiz-card">
          <p>You scored {score} out of {questions.length}.</p>
          <button onClick={restart} className="submit-button">Play Again</button>
        </div>
      </div>
    );
  }

  const question = questions[current];
  const progress = (current / questions.length) * 100;


  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quiz Time!</h2>
      <div className="quiz-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option) => (
              <label key={option} className="quiz-option">
                <input type="radio" value={option} {...register('answer')} />
                {option}
              </label>
            ))}
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        {feedback && (
          <Alert type={feedback.includes('Correct') ? 'success' : 'error'}>
            {feedback}
          </Alert>
        )}
        <p className="score">Score: {score}</p>
      </div>
    </div>
  );
};

export default Quiz;

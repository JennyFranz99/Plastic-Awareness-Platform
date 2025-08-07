import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import questions from '../data/quizQuestions.json';

const Alert = ({ type, children }) => (
  <div role="alert" style={{ color: type === 'success' ? 'green' : 'red' }}>
    {children}
  </div>
);

const Quiz = () => {
const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const answer = data.answer;
    if (answer === questions[current].answer) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        setFeedback('');
        setCurrent((prev) => prev + 1);
        reset();
      }, 1000);
    } else {
      setFeedback('❌ Try again');
    }
  };

  if (current >= questions.length) {
    return (
      <div>
        <h1>Quiz</h1>
        <p>You have completed the quiz.</p>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div>
      <h1>Quiz</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>{question.question}</legend>
          {question.options.map((option) => (
            <label key={option} style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="radio" value={option} {...register('answer')} />{' '}
              {option}
            </label>
          ))}
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {feedback && (
        <Alert type={feedback.includes('Correct') ? 'success' : 'error'}>
          {feedback}
        </Alert>
      )}
    </div>
  );
};

export default Quiz;

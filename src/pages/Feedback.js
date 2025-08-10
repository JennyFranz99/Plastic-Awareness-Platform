// src/pages/Feedback.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Feedback = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

   const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'feedback'), data);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'feedback_submitted', {
          event_category: 'engagement',
        });
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };


  return (
    <div>
      <h2>Feedback</h2>
      {submitted ? (
        <p>✅ Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Name:</label><br />
                        <input type="text" {...register('name', { required: true })} />
            {errors.name && <span>Name is required</span>}
          </div>
          <div>
            <label>Message:</label><br />
           <textarea rows="4" {...register('message', { required: true })} />
            {errors.message && <span>Message is required</span>}
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
        </form>
      )}
    </div> 
  );        
};

export default Feedback;

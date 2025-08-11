// src/pages/Feedback.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Feedback.css';



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
    <div className="feedback-container">
      <h2 className="feedback-title">Feedback</h2>
      {submitted ? (
        <p>✅ Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
          <div>
            <label>Name:</label><br />
                                    <input type="text" {...register('name', { required: true })} />

            {errors.name && <span>Name is required</span>}
          </div>
           <div>
            <label>Email:</label><br />
            <input type="email" {...register('email', { required: true })} />
            {errors.email && <span>Email is required</span>}
          </div>
          <div>
            <label>Message:</label><br />
                       <textarea rows="4" {...register('message', { required: true })} />
            {errors.message && <span>Message is required</span>}
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div> 
  );        
};

export default Feedback;

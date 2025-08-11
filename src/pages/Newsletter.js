// src/pages/Newsletter.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Newsletter.css';

const Newsletter = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'newsletter'), data);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Error subscribing:', err);
    }
  };

  return (
    <div className="newsletter-container">
      <h2>Subscribe for weekly pollution emails</h2>
      {submitted ? (
        <p>✅ Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
          />
          {errors.email && <span>Email is required</span>}
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
// src/pages/Feedback.js
import React, { useState } from 'react';

const Feedback = () => {
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', form);
    setSubmitted(true);
    setForm({ name: '', message: '' });
  };

  return (
    <div>
      <h2>Feedback</h2>
      {submitted ? (
        <p>✅ Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Message:</label><br />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
        </form>
      )}
    </div> 
  );        
};

export default Feedback;

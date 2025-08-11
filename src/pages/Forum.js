// src/pages/Forum.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './Forum.css';

const Forum = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'forumPosts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'forumPosts'), { ...data, timestamp: new Date() });
      reset();
    } catch (err) {
      console.error('Error posting message:', err);
    }
  };

  return (
    <div className="forum-container">
      <h2>Community Forum</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="forum-form">
        <input type="text" placeholder="Name" {...register('name', { required: true })} />
        {errors.name && <span>Name is required</span>}
        <textarea
          placeholder="Share your thoughts..."
          rows="4"
          {...register('message', { required: true })}
        />
        {errors.message && <span>Message is required</span>}
        <button type="submit">Post</button>
      </form>
      <ul className="forum-posts">
        {posts.map(post => (
          <li key={post.id} className="forum-post">
            <strong>{post.name}</strong>: {post.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Forum;
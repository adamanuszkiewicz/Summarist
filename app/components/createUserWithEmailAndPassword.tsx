// app/signup/page.tsx (or similar)
"use client"; // If using Next.js 13+ App Router

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation'; // Use appropriate router for your Next.js version

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User signed up successfully
      router.push('/'); // Redirect to the home page or a dashboard
    } catch (err) {
      // Handle Errors
      const firebaseError = err as AuthError;
      setError(firebaseError.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignUp;

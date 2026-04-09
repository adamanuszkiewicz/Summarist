// src/components/SignInButton.tsx
"use client"; // If using Next.js 13+ App Router, this makes it a client component

import React from 'react';
import { signInWithPopup, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebaseConfig'; // Adjust the path as needed

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    // User is signed in. You can handle post-sign-in logic here.
  } catch (error) {
    // Handle Errors here.
    console.error(error);
  }
};



const SignInButton: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      // The user's information, including the email address, is in the result object
      const user = result.user;
      const email = user.email; // This is the Gmail address
      console.log("Signed in user:", user);
      console.log("User email:", email);

      // You can now use the email for sign up/registration in your application logic
      // ... additional logic to store user info in your database if needed ...

    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign In with Google
    </button>
  );
};

export default SignInButton;
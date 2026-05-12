"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdPerson } from "react-icons/io";
import { FirebaseError } from 'firebase/app';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebaseConfig';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  redirectTo?: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup, redirectTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter();

  const redirectIfNeeded = () => {
    if (redirectTo === null) {
      return;
    }
    router.push(redirectTo ?? '/forYou');
  };

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {

      setErrorMessage('');
     
      await signInWithPopup(auth, googleProvider);
      onClose();
      redirectIfNeeded();
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setErrorMessage('');
      await signInWithEmailAndPassword(auth, "test@email.com", "test1234");
      onClose();
      redirectIfNeeded();
    } catch (error: any) {
      console.error("Guest login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // If user doesn't exist, create the account
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          console.log("Attempting to create guest account...");
          await createUserWithEmailAndPassword(auth, "test@email.com", "test1234");
          console.log("Guest account created successfully!");
          onClose();
          redirectIfNeeded();
        } catch (createError: any) {
          console.error("Error creating guest account:", createError);
          console.error("Create error code:", createError.code);
          console.error("Create error message:", createError.message);
          alert(`Failed to create guest account: ${createError.message}`);
        }
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage('')
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      redirectIfNeeded();
    } catch (error: unknown) {
      console.error("Email login error:", error);

      setEmail('');
      setPassword('');

      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes('google.com') && !methods.includes('password')) {
            setErrorMessage('This email is registered with Google. Use Login with Google instead.');
            return;
          }

          if (methods.includes('password')) {
            setErrorMessage('That password is incorrect for this email account.');
            return;
          }

          setErrorMessage('No email/password account exists for this email. Sign up first or use the correct provider.');
          return;
        }

        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Enter a valid email address.');
          return;
        }

        if (error.code === 'auth/operation-not-allowed') {
          setErrorMessage('Email/password sign-in is not enabled in Firebase Authentication.');
          return;
        }

        if (error.code === 'auth/too-many-requests') {
          setErrorMessage('Too many attempts. Please wait a moment and try again.');
          return;
        }
      }

      setErrorMessage('Unable to sign in right now. Please try again.');
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="auth__wrapper">
          <div className="auth">
            <div className="auth__content">
              <div className="auth__title">Log in to Summarist</div>
              <button className='btn guest__btn--wrapper' onClick={handleGuestLogin}>
                <figure className='person'><IoMdPerson /></figure>
                <div className='btn__txt'>Login as guest</div>
              </button>
              <div className="auth__separator">
                <span className='auth__separator--text'>or</span>
              </div>
              <button className='btn google__btn--wrapper' onClick={handleGoogleSignIn}>
                <img className='google__img' src="/assets/google.png" alt="" />
                <div className='btn__txt'>Login with Google</div>
              </button>
              <div className="auth__separator">
                <span className='auth__separator--text'>or</span>
              </div>
              <form className="auth__main--form" onSubmit={handleEmailLogin}>
                <input 
                  type='email' 
                  placeholder='Email Address' 
                  className='login__input'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  required
                />
                <input 
                  type='password' 
                  placeholder='Password' 
                  className='login__input'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  required
                />
                {errorMessage && <p className='auth__error-message'>{errorMessage}</p>}
                <button type='submit' className='btn login__btn--wrapper'>
                  <span>Login</span>
                </button>
              </form>
              <button className='auth__forgot--password'>Forgot your password?</button>
            </div>
            <button type='button' className='auth__close--btn' onClick={onClose} aria-label='Close login modal'>
              <img className='x-icon' src="/assets/x-icon.jpg" alt="Close" onClick={onClose} />
            </button>
            <button className='auth__switch--btn' onClick={onSwitchToSignup}>Don't have an account?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

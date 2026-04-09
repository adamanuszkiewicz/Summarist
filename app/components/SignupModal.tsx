"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { IoMdPerson } from "react-icons/io";
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebaseConfig';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  redirectTo?: string | null;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin, redirectTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const redirectIfNeeded = () => {
    if (redirectTo === null) {
      return;
    }
    router.push(redirectTo ?? '/forYou');
  };

  if (!isOpen) return null;

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      redirectIfNeeded();
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
      redirectIfNeeded();
    } catch (error) {
      console.error("Email sign-up error:", error);
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="auth__wrapper">
          <div className="auth">
            <div className="auth__content">
              <div className="auth__title">Sign up to Summarist</div>
              
              <button className="btn google__btn--wrapper" onClick={handleGoogleSignUp}>
                <img
                  className="google__img"
                  src="/assets/google.png"
                  alt=""
                />
                <div className="btn__txt">Sign up with Google</div>
              </button>
              <div className="auth__separator">
                <span className="auth__separator--text">or</span>
              </div>
              <form className="auth__main--form" onSubmit={handleEmailSignUp}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="login__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="login__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn login__btn--wrapper">
                  <span>Sign up</span>
                </button>
              </form>
            </div>
            <button type="button" className="auth__close--btn" onClick={onClose} aria-label="Close sign up modal">
              <img className="x-icon" src="/assets/x-icon.jpg" alt="Close" onClick={onClose} />
            </button>
            <button className="auth__switch--btn-2" onClick={onSwitchToLogin}>
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

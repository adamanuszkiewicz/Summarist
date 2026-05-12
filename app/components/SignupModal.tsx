"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithPopup, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebaseConfig";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  redirectTo?: string | null;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin, redirectTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("");
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
      setErrorMessage("");
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
      redirectIfNeeded();
    } catch (error) {
      console.error("Email sign-up error:", error);

      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes("google.com") && !methods.includes("password")) {
            setErrorMessage("This email is already registered with Google. Use Sign up with Google or Login with Google.");
            return;
          }

          if (methods.includes("password")) {
            setErrorMessage("An email/password account already exists for this email. Try logging in instead.");
            return;
          }

          setErrorMessage("An account already exists for this email.");
          return;
        }

        if (error.code === "auth/invalid-email") {
          setErrorMessage("Enter a valid email address.");
          return;
        }

        if (error.code === "auth/weak-password") {
          setErrorMessage("Password must be at least 6 characters.");
          return;
        }

        if (error.code === "auth/operation-not-allowed") {
          setErrorMessage("Email/password sign-up is not enabled in Firebase Authentication.");
          return;
        }
      }

      setErrorMessage("Unable to sign up right now. Please try again.");
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) {
                      setErrorMessage("");
                    }
                  }}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="login__input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) {
                      setErrorMessage("");
                    }
                  }}
                  required
                />
                {errorMessage && <p className="auth__error-message">{errorMessage}</p>}
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

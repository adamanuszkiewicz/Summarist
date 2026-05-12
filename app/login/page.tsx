"use client";

import React, { useState } from 'react'
import { IoMdPerson } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth'
import { auth, googleProvider } from '../utils/firebaseConfig'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/forYou')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  const handleGuestLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'test@email.com', 'test1234')
      router.push('/forYou')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, 'test@email.com', 'test1234')
          router.push('/forYou')
        } catch (createError) {
          console.error('Error creating guest account:', createError)
          alert('Failed to create guest account.')
        }
      } else {
        console.error('Guest login error:', error)
        alert('Login failed.')
      }
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/forYou')
    } catch (error: unknown) {
      console.error('Email login error:', error)

      setEmail('')
      setPassword('')

      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          const methods = await fetchSignInMethodsForEmail(auth, email)

          if (methods.includes('google.com') && !methods.includes('password')) {
            setErrorMessage('This email is registered with Google. Use Login with Google instead.')
            return
          }

          if (methods.includes('password')) {
            setErrorMessage('That password is incorrect for this email account.')
            return
          }

          setErrorMessage('No email/password account exists for this email. Sign up first or use the correct provider.')
          return
        }

        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Enter a valid email address.')
          return
        }

        if (error.code === 'auth/operation-not-allowed') {
          setErrorMessage('Email/password sign-in is not enabled in Firebase Authentication.')
          return
        }

        if (error.code === 'auth/too-many-requests') {
          setErrorMessage('Too many attempts. Please wait a moment and try again.')
          return
        }
      }

      setErrorMessage('Unable to sign in right now. Please try again.')
    }
  }

  return (
    <div>
      <div id='login'>
        <div className="login__container">
          <div className="wrapper login__wrapper--full">
            <div className="sidebar__overlay sidebar__overlay--hidden"></div>
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
                        setEmail(e.target.value)
                        if (errorMessage) {
                          setErrorMessage('')
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
                        setPassword(e.target.value)
                        if (errorMessage) {
                          setErrorMessage('')
                        }
                      }}
                      required
                    />
                    {errorMessage && <p className='auth__error-message'>{errorMessage}</p>}
                    <button type='submit' className='btn login__btn--wrapper '>
                      <span>Login</span>
                    </button>
                  </form>
                <div className='auth__forgot--password'>Forgot your password?</div>
                </div>
                <button className='auth__close--btn'><img className='x-icon' src="/assets/x-icon.jpg" alt="" /></button>
                <button className='auth__switch--btn'>Don't have an account?'</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
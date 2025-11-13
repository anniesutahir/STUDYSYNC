

import React, { useState } from 'react';
import { auth, db, firebase } from '../services/firebase';
import { BookOpenIcon } from './Icons';
import { THEMES } from '../constants';
import { playSound } from '../services/soundService';

// Helper function to create a new user document in Firestore
const createNewUserDocument = async (user: firebase.User, username: string) => {
  const userDocRef = db.collection('users').doc(user.uid);
  const newUserProfile = {
    uid: user.uid,
    email: user.email,
    username: username,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    theme: THEMES[0], // default light theme
  };
  await userDocRef.set(newUserProfile);
  console.log("Successfully created new user document in Firestore:", newUserProfile);
};

export const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('test@test.com');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    // Reset fields when switching forms
    setEmail(isLoginView ? '' : 'test@test.com');
    setPassword(isLoginView ? '' : '123456');
    setConfirmPassword('');
    setUsername('');
  };

  const handleLogin = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        const userDocRef = db.collection('users').doc(user.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists) {
            await userDocRef.update({ lastLogin: firebase.firestore.FieldValue.serverTimestamp() });
            console.log("User lastLogin timestamp updated.");
        } else {
            // This is a fallback for users that exist in Auth but not in Firestore
            console.warn("User document not found in Firestore. Creating one now.");
            const defaultUsername = user.email?.split('@')[0] || 'studysync_user';
            await createNewUserDocument(user, defaultUsername);
        }
        playSound('login');
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err instanceof Error) {
        setError(`Login failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        // Add user to 'users' collection in Firestore
        await createNewUserDocument(user, username);
        playSound('add');
      }
    } catch (err) {
      console.error("Sign Up Error:", err);
      if (err instanceof Error) {
        setError(`Sign up failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    if (isLoginView) {
      await handleLogin();
    } else {
      await handleSignUp();
    }
  };

  return (
    <div 
      className="min-h-screen bg-primary-light dark:bg-primary-dark flex flex-col justify-center items-center p-4"
      style={{ '--theme-accent': '#14b8a6' } as React.CSSProperties}
    >
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center mb-6">
          <BookOpenIcon className="w-12 h-12 mr-3 text-teal-500 dark:text-blue-500" />
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">STUDYSYNC</h1>
        </div>

        <div className="bg-secondary-light dark:bg-secondary-dark p-8 rounded-2xl shadow-2xl border-2 border-blue-500">
          <h2 className="text-2xl font-bold text-center mb-1 text-text-light dark:text-text-dark">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">{isLoginView ? 'Sign in to sync your studies.' : 'Sign up to get started.'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)] sm:text-sm bg-primary-light dark:bg-primary-dark" />
              </div>
            </div>
            
            {!isLoginView && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <div className="mt-1">
                  <input id="username" name="username" type="text" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)] sm:text-sm bg-primary-light dark:bg-primary-dark" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete={isLoginView ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)] sm:text-sm bg-primary-light dark:bg-primary-dark" />
              </div>
            </div>
            
            {!isLoginView && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <div className="mt-1">
                  <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)] sm:text-sm bg-primary-light dark:bg-primary-dark" />
                </div>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center animate-shake">{error}</p>}

            <div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[var(--theme-accent)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-accent)] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-secondary-light dark:bg-secondary-dark text-gray-500 dark:text-gray-400">
                  {isLoginView ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={toggleView}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm bg-primary-light dark:bg-primary-dark text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                {isLoginView ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
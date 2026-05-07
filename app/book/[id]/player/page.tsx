"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AudioPlayer from "@/app/components/AudioPlayer";
import { Book } from "@/data/tracks";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import LoginModal from "@/app/components/LoginModal";
import SignupModal from "@/app/components/SignupModal";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/utils/firebaseConfig";

export default function PlayerPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState("16px");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  // Load font size from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("audiobook-font-size");
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("audiobook-font-size", size);
  };

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div id="audiobook">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          showFontSizeControls={true}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
        />
        <div className="audiobook__main--content">
          <Searchbar toggleSidebar={toggleSidebar} />
          <div className="audiobook__container">
            <div className="audiobook__row">
              <div className="audiobook__wrapper">
                <div className="audiobook__summary">
                  <div className="audiobook__summary--title-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                  <div className="audiobook__summary--text-skeleton-loading2"></div>
                  <div className="audiobook__summary--text-skeleton-loading"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div id="audiobook">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          showFontSizeControls={true}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
        />
        <div className="audiobook__main--content">
          <Searchbar toggleSidebar={toggleSidebar} />
          <p>Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div id="audiobook">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onSwitchToSignup={handleSwitchToSignup}
        redirectTo={null}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSwitchToLogin={handleSwitchToLogin}
        redirectTo={null}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        showFontSizeControls={true}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
      <div className="audiobook__main--content">
        <Searchbar toggleSidebar={toggleSidebar} />
        {isLoggedIn ? (
          <>
            <div className="audiobook__container">
              <div className="audiobook__row">
                <div className="audiobook__wrapper">
                  <div className="audiobook__summary">
                    <div className="audiobook__summary--title">{book.title}</div>
                    <div className="audiobook__summary--text" style={{ fontSize }}>
                      {book.summary}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AudioPlayer book={book} />
          </>
        ) : (
          <div className="login__wrapper">
            <div className="login__container">
              <div className="login__row">
                <h1 className="login__title">Player</h1>
                <div className="settings__login--wrapper">
                  <figure className="login__image">
                    <img
                      className="login__img"
                      src="/assets/login.png"
                      alt="Login illustration"
                    />
                  </figure>
                  <div className="settings__login--text">
                    Log in to read, or listen, to the book's summary'.
                  </div>
                  <button
                    type="button"
                    className="btn settings__login--btn"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

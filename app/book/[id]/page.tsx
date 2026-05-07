"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import { FaRegStar } from "react-icons/fa";
import { TfiTimer } from "react-icons/tfi";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LiaReadme } from "react-icons/lia";
import { IoMicOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { TbMicrophone } from "react-icons/tb";
import { Book } from "@/data/tracks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/utils/firebaseConfig";
import LoginModal from "@/app/components/LoginModal";
import SignupModal from "@/app/components/SignupModal";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [audioDuration, setAudioDuration] = useState<string>("0:00");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [modalRedirectTo, setModalRedirectTo] = useState<string | null>(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Format time helper
  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return "0:00";
  };



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const loggedIn = Boolean(user);
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
        return;
      }

      setModalRedirectTo(null);
      setIsSignupModalOpen(false);
      setIsLoginModalOpen(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`,
        );
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);


  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setModalRedirectTo(null);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleStartPlayer = () => {
    if (!book) {
      return;
    }

    if (isLoggedIn) {
      router.push(`/book/${book.id}/player`);
      return;
    }

    setModalRedirectTo(`/book/${book.id}/player`);
    setIsLoginModalOpen(true);
  };





  if (isLoading) {
    return (
      <div className="book__skeleton-page">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="book__skeleton-loading">
          <Searchbar toggleSidebar={toggleSidebar} />
          <div className="book-container__skeleton-loading">
            <div className="inner-book__row-skeleton-loading">
              <div className="inner-book__title-skeleton-loading"> </div>
              <div className="inner-book__author-skeleton-loading"></div>
              <div className="inner-book__sub-title-skeleton-loading"></div>
              <div className="inner-book__wrapper--skeleton-loading"></div>
              <div className="inner-book__btn-wrapper-skeleton-loading"></div>
              <div className="inner-book__bookmark-skeleton-loading"></div>
              <div className="inner-book__secondary--title-skeleton-loading"></div>
              <div className="inner-book__tags--wrapper-skeleton-loading"></div>
              <div className="inner-book__book--description-skeleton-loading"></div>
              <div className="inner-book__tags--wrapper-skeleton-loading"></div>
              <div className="inner-book__book--description-skeleton-loading"></div>
            </div>
              <div className="inner-book__image--wrapper">
                <div className="book__img-skeleton-loading"></div>

              </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 p-8">
          <p>Book not found</p>
        </div>
      </div>
    );
  }

  const currentBook = book;

  return (
    <div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onSwitchToSignup={handleSwitchToSignup}
        redirectTo={modalRedirectTo}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSwitchToLogin={handleSwitchToLogin}
        redirectTo={modalRedirectTo}
      />
      <div id="book-info">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="inner-book__main-content">
          <Searchbar toggleSidebar={toggleSidebar} />
          {isLoggedIn ? (
            <div className="inner__book--row">
              <audio
                src={currentBook.audioLink}
                onLoadedMetadata={(e) => {
                  const audio = e.currentTarget;
                  setAudioDuration(formatTime(audio.duration));
                }}
              ></audio>
              <div className="inner__book--container">
                <div className="inner__book--inner-wrapper">
                  <div className="inner__book">
                    <div className="inner-book__title">{currentBook.title}</div>
                    <div className="inner-book__author">{currentBook.author}</div>
                    <div className="inner-book__sub--title">{currentBook.subTitle}</div>
                    <div className="inner-book__wrapper">
                      <div className="inner-book__description--wrapper">
                        <div className="inner-book__description">
                          <div className="inner-book__icon">
                            <FaRegStar />
                          </div>
                          <div className="inner-book__overall--rating">
                            {currentBook.averageRating} ({currentBook.totalRating} Ratings)
                          </div>
                          <div className="inner-book__total--rating"></div>
                        </div>
                        <div className="inner-book__description">
                          <div className="inner-book__icon">
                            <TfiTimer />
                          </div>
                          <div className="inner-book__duration">
                            {audioDuration}
                          </div>
                        </div>
                        <div className="inner-book__description">
                          <div className="inner-book__icon">
                            <TbMicrophone />
                          </div>
                          <div className="inner-book__type">{currentBook.type}</div>
                        </div>
                        <div className="inner-book__description">
                          <div className="inner-book__icon">
                            <HiOutlineLightBulb />
                          </div>
                          <div className="inner-book__key--ideas">
                            {currentBook.keyIdeas} key ideas
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="inner-book__read--btn-wrapper">
                      <button
                        className="inner-book__read--btn"
                        onClick={handleStartPlayer}
                      >
                        <div className="inner-book__read--icon">
                          <LiaReadme />
                        </div>
                        <div className="inner-book__read--text">Read</div>
                      </button>
                      <button
                        className="inner-book__read--btn"
                        onClick={handleStartPlayer}
                      >
                        <div className="inner-book__listen--icon">
                          <IoMicOutline />
                        </div>
                        <div className="inner-book__listen--text">Listen</div>
                      </button>
                    </div>
                    <div className="inner-book__bookmark">
                      <div className="inner-book__bookmark--icon">
                        <CiBookmark />
                      </div>
                      <div className="inner-book__bookmark--text">
                        Add title to My Library
                      </div>
                    </div>
                    <h2 className="inner-book__secondary--title">
                      What's it about?
                    </h2>
                    <div className="inner-book__tags--wrapper">
                      {currentBook.tags &&
                        currentBook.tags.map((tag, index) => (
                          <div key={index} className="inner-book__tag">
                            {tag}
                          </div>
                        ))}
                    </div>
                    <div className="inner-book__book--description">
                      {currentBook.bookDescription}
                    </div>
                    <h2 className="inner-book__secondary--title">
                      About the author
                    </h2>
                    <div className="inner-book__author--description">
                      {currentBook.authorDescription}
                    </div>
                  </div>
                  <div className="inner-book__image--wrapper">
                    <figure className="book__image--wrapper">
                      <img
                        className="book__image"
                        src={currentBook.imageLink}
                        alt={currentBook.title}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="login__wrapper">
              <div className="login__container">
                <div className="login__row">
                  <h1 className="login__title">Book</h1>
                  <div className="settings__login--wrapper">
                    <figure className="login__image">
                      <img
                        className="login__img"
                        src="/assets/login.png"
                        alt="Login illustration"
                      />
                    </figure>
                    <div className="settings__login--text">
                      Log in to your account to see your details.
                    </div>
                    <button
                      type="button"
                      className="btn settings__login--btn"
                      onClick={() => {
                        setModalRedirectTo(null);
                        setIsLoginModalOpen(true);
                      }}
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
    </div>
  );
}

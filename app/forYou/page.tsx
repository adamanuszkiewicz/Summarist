"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import { GiPlayButton } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { TfiTimer } from "react-icons/tfi";
import type { Book } from "@/data/tracks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const ForYou = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [audioDurations, setAudioDurations] = useState<Record<string, string>>(
    {},
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const [selectedResponse, recommendedResponse, suggestedResponse] =
          await Promise.all([
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
              { signal: controller.signal },
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
              { signal: controller.signal },
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
              { signal: controller.signal },
            ),
          ]);

        const [selectedData, recommendedData, suggestedData] =
          await Promise.all([
            selectedResponse.json(),
            recommendedResponse.json(),
            suggestedResponse.json(),
          ]);

        if (!isMounted) {
          return;
        }

        const selected =
          Array.isArray(selectedData) && selectedData.length > 0
            ? (selectedData[0] as Book)
            : null;

        setSelectedBook(selected);
        setRecommendedBooks(
          Array.isArray(recommendedData) ? (recommendedData as Book[]) : [],
        );
        setSuggestedBooks(
          Array.isArray(suggestedData) ? (suggestedData as Book[]) : [],
        );
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") {
          return;
        }
        console.error("Error fetching books:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });

    return () => unsubscribe();
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

  const formatDuration = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return "00:00";
  };

  const handleLoadedMetadata =
    (bookId: string) => (e: React.SyntheticEvent<HTMLAudioElement>) => {
      const audio = e.currentTarget;
      const formattedDuration = formatDuration(audio.duration);

      setAudioDurations((prev) => {
        if (prev[bookId] === formattedDuration) {
          return prev;
        }
        return { ...prev, [bookId]: formattedDuration };
      });
    };

  if (loading) {
    return (
      <div className="for-you__skeleton-page">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="for-you__book--skeleton-loading">
          <Searchbar toggleSidebar={toggleSidebar} />
          <div className="for-you__wrapper-skeleton-loading">
            <div className="for-you__container">
              <div className="for-you__row-skeleton-loading">
                <div className="for-you__title">Selected just for you</div>
                <div className="selected__book-skeleton-loading"></div>

                <div>
                  <div className="for-you__title">Recommended for you</div>
                  <div className="for-you__sub-title">
                    We think you'll like these
                  </div>
                  <div className="for-you__recommended-books">
                    <div className="recommended__books--row-skeleton-loading">
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="for-you__title">Suggested Books</div>
                  <div className="for-you__sub-title">Browse these books</div>
                  <div className="for-you__suggested-books">
                    <div className="recommended__books--row-skeleton-loading">
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                      <div className="skeleton__book">
                        <div className="recommended__book--img-skeleton-loading"></div>
                        <div className="skeleton__title"></div>
                        <div className="skeleton__author"></div>
                        <div className="skeleton__sub-title"></div>
                        <div className="skeleton__selected__book--duration-wrapper"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <div id="for-you">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLoginClick={handleLoginClick}
        />
        <div className="for-you__main-content">
          <Searchbar toggleSidebar={toggleSidebar} />
          <div className="for-you__row">
            <div className="for-you__container">
              <div className="for-you__wrapper">
                <div className="for-you__title">Selected just for you</div>
                {selectedBook && (
                  <>
                    <audio
                      src={selectedBook.audioLink}
                      preload="metadata"
                      onLoadedMetadata={handleLoadedMetadata(selectedBook.id)}
                    ></audio>
                    <Link
                      className="selected__book"
                      href={`/book/${selectedBook.id}`}
                    >
                      <div className="selected__book--sub-title">
                        {selectedBook.subTitle}
                      </div>
                      <div className="selected__book--line"></div>
                      <div className="selected__book--content">
                        <figure className="book__image--wrapper">
                          <img
                            className="selected__book--img"
                            src={selectedBook.imageLink}
                            alt={selectedBook.title}
                          />
                        </figure>
                        <div className="selected__book--text">
                          <div className="selected__book--title">
                            {selectedBook.title}
                          </div>
                          <div className="selected__book--author">
                            {selectedBook.author}
                          </div>
                          <div className="selected__book--duration-wrapper">
                            <div className="selected__book--icon">
                              <GiPlayButton />
                            </div>
                            <div className="inner__book--duration">
                              {audioDurations[selectedBook.id] ?? "00:00"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                )}
                <div>
                  <div className="for-you__title">Recommended for you</div>
                  <div className="for-you__sub-title">
                    We think you'll like these
                  </div>
                  <div className="for-you__recommended-books">
                    {recommendedBooks.map((book, index) => (
                      <Link
                        key={book.id}
                        className="for-you__recommended--books-link"
                        href={`/book/${book.id}`}
                      >
                        {!isLoggedIn && index >= 2 && (
                          <div className="book__pill book__pill--subscription-required">
                            Premium
                          </div>
                        )}
                        <audio
                          src={book.audioLink}
                          preload="metadata"
                          onLoadedMetadata={handleLoadedMetadata(book.id)}
                        ></audio>
                        <img
                          className="recommended__book--img"
                          src={book.imageLink}
                          alt={book.title}
                        />
                        <div className="recommended__book--title">
                          {book.title}
                        </div>
                        <div className="recommended__book--author">
                          {book.author}
                        </div>
                        <div className="recommended__book--sub-title">
                          {book.subTitle}
                        </div>
                        <div className="recommended__book--details-wrapper">
                          <div className="recommended__book--details">
                            {audioDurations[book.id] ?? "00:00"}
                            <div className="recommended__book--icon">
                              <TfiTimer />
                            </div>
                          </div>
                          <div className="recommended__book--details">
                            {book.averageRating}
                            <div className="recommended__book--icon">
                              <FaRegStar />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="for-you__title">Suggested Books</div>
                  <div className="for-you__sub-title">Browse these books</div>
                  <div className="for-you__suggested-books">
                    {suggestedBooks.map((book) => (
                      <Link
                        key={book.id}
                        className="for-you__suggested--books-link"
                        href={`/book/${book.id}`}
                      >
                        {!isLoggedIn && (
                          <div className="book__pill book__pill--subscription-required">
                            Premium
                          </div>
                        )}
                        <audio
                          src={book.audioLink}
                          preload="metadata"
                          onLoadedMetadata={handleLoadedMetadata(book.id)}
                        ></audio>
                        <img
                          className="suggested__book--img"
                          src={book.imageLink}
                          alt={book.title}
                        />
                        <div className="suggested__book--title">
                          {book.title}
                        </div>
                        <div className="suggested__book--author">
                          {book.author}
                        </div>
                        <div className="suggested__book--sub-title">
                          {book.subTitle}
                        </div>
                        <div className="suggested__book--details-wrapper">
                          <div className="suggested__book--details">
                            {audioDurations[book.id] ?? "00:00"}
                            <div className="suggested__book--icon">
                              <TfiTimer />
                            </div>
                          </div>
                          <div className="suggested__book--details">
                            {book.averageRating}
                            <div className="suggested__book--icon">
                              <FaRegStar />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYou;

"use client";

import React, { useState, useEffect } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

interface SearchbarProps {
  toggleSidebar: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeBooks = (data: unknown): Book[] => {
    if (Array.isArray(data)) {
      return data as Book[];
    }

    if (data && typeof data === "object") {
      const maybeBooks = (data as { books?: unknown; data?: unknown; items?: unknown })
        .books ?? (data as { data?: unknown }).data ?? (data as { items?: unknown }).items;

      if (Array.isArray(maybeBooks)) {
        return maybeBooks as Book[];
      }
    }

    return [];
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks([]);
      setShowResults(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const runSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const encoded = encodeURIComponent(searchTerm.trim());
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encoded}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        const books = normalizeBooks(data);
        const term = searchTerm.trim().toLowerCase();
        const filtered = books.filter(
          (book) =>
            (book.title || "").toLowerCase().includes(term) ||
            (book.author || "").toLowerCase().includes(term)
        );
        console.log("Search term:", searchTerm, "Results:", filtered.length);
        setFilteredBooks(filtered);
        setShowResults(true);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") {
          return;
        }
        console.error("Error fetching books:", err);
        setError("Unable to load books");
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = window.setTimeout(runSearch, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== "") {
      setShowResults(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim() !== "") {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="searchbar__wrapper">
      <div className="search__background">
        <div className="search__wrapper">
          <figure>
            <img src="logo" alt="" />
          </figure>
          <div className="search__content">
            <div className="search">
              <div className="search__input--wrapper">
                <input
                  className="search__input"
                  placeholder="Search for books"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                />
                <button
                  type="button"
                  className="search__icon"
                  onClick={searchTerm.trim() ? handleClearSearch : undefined}
                  aria-label={searchTerm.trim() ? "Clear search" : "Search"}
                >
                  {searchTerm.trim() ? <IoMdClose /> : <IoMdSearch />}
                </button>
              </div>
              {showResults && searchTerm.trim() !== "" && (
                <div className="search__results">
                  {isLoading ? (
                    <div className="search__result--empty">Loading…</div>
                  ) : error ? (
                    <div className="search__result--empty">{error}</div>
                  ) : filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <Link
                        key={book.id}
                        href={`/book/${book.id}`}
                        onClick={handleResultClick}
                        className="search__result--item"
                      >
                        <img
                          src={book.imageLink}
                          alt={book.title}
                          className="search__result--image"
                        />
                        <div className="search__result--info">
                          <div className="search__result--title">
                            {book.title}
                          </div>
                          <div className="search__result--author">
                            {book.author}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="search__result--empty">No results found</div>
                  )}
                </div>
              )}
            </div>
            <div className="sidebar__toggle--btn" onClick={toggleSidebar}>
              <RxHamburgerMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;

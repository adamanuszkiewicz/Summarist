"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AudioPlayer from "@/app/components/AudioPlayer";
import { Book } from "@/data/tracks";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";

export default function PlayerPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState("16px");

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
                <div className="audiobook__summary--title">{book.title}</div>
                <div className="audiobook__summary--text" style={{ fontSize }}>
                  {book.summary}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AudioPlayer book={book} />
      </div>
    </div>
  );
}

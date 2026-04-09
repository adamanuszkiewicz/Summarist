"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Book } from "@/data/tracks";
import { formatAudioTime } from "../utils/formatAudioTime";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { TbRewindBackward10 } from "react-icons/tb";
import { TbRewindForward10 } from "react-icons/tb";

interface AudioPlayerProps {
  book: Book;
}

const AudioPlayer = ({ book }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // References
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const playAnimationRef = useRef<number | null>(null);

  // Update progress bar as audio plays
  const repeat = useCallback(() => {
    if (audioRef.current && progressBarRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();

      // Update the CSS variable for the visual "filled" look of the slider
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(Number(progressBarRef.current.value) / duration) * 100}%`,
      );

      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [duration]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    }
  }, [isPlaying, audioRef, repeat]);

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      audioRef.current.currentTime = Number(progressBarRef.current.value);
    }
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    setDuration(seconds || 0);
    if (progressBarRef.current) {
      progressBarRef.current.max = seconds?.toString() || "0";
    }
  };

  const skipBackward = () => {
  if (audioRef.current) {
    // Subtract 10 seconds, but don't go below 0
    audioRef.current.currentTime = Math.max(0, 
    audioRef.current.currentTime - 10);
  }
};

const skipForward = () => {
  if (audioRef.current) {
    // Add 10 seconds, but don't go past the total duration
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10
    );
  }
};

  return (
        // <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
        <div className="audio__wrapper">
          {/* Hidden Audio Element */}
            <audio
              src={book.audioLink}
              ref={audioRef}
              onLoadedMetadata={onLoadedMetadata}
            />
            <div className="audio__track--wrapper">
                <figure
                  className="audio__track--image-mask"
                  style={{ whiteSpace: "pre-line" }}
                  >
                    <figure className="audio__track--book--image-wrapper">
                        <img
                            className="audio__track--image"
                            src={book.imageLink}
                            alt={book.title}
                        />
                    </figure>
                </figure>
                <div className="audio__track--details-wrapper">
                    <div className="audio__track--title">{book.title}</div>
                    <div className="audio__track--author">{book.author}</div>
                </div>
            </div>
            <div className="controls-wrapper">
                <div className="middle-controls">
                    <button onClick={skipBackward} className="back10__btn">
                      <TbRewindBackward10 />
                    </button>
                    <button className="start-stop__btn" onClick={togglePlayPause}>
                      {isPlaying ? (
                        <FaPause style={{ height: "26px" }} />
                      ) : (
                        <FaPlay style={{ marginLeft: "4px" }} />
                      )}
                    </button>
                    <button onClick={skipForward} className="forward10__btn">
                      <TbRewindForward10 />
                    </button>
                </div>
            </div>
            <div className="progress-container">
                <span className="duration-left">{formatAudioTime(timeProgress)}</span>
                <input
                  className="slider"
                  type="range"
                  ref={progressBarRef}
                  defaultValue="0"
                  onChange={handleProgressChange}
                />
                {/* Displaying the total duration on the right */}
                <span className="duration-right">{formatAudioTime(duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;

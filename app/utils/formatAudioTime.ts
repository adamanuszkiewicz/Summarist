export const formatAudioTime = (time: number) => {
  if (Number.isFinite(time) && time > 0) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return "00:00";
};

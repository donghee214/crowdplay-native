export const msToMinuteString = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  let seconds = (totalSeconds % 60).toString();
  if (totalSeconds % 60 < 10) {
    seconds = '0' + seconds
  }
  return `${minutes}:${seconds}`;
};

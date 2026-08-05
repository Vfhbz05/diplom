export const formatTotalLoggedTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return "0 сек.";

  if (totalSeconds < 60) {
    return `${totalSeconds} сек.`;
  }

  if (totalSeconds < 3600) {
    const minutes = Math.round(totalSeconds / 60);
    return `${minutes} мин.`;
  }

  const hours = (totalSeconds / 3600).toFixed(1).replace(".0", "");
  return `${hours} ч.`;
};
export const formatDeadline = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }); 
};
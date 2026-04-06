export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36)
  );
};

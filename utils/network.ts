export const simulateNetwork = (delay: number = 600): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

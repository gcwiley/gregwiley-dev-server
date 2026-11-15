// Utility function to validate URLs. Returns true if the URL is valid or empty, false otherwise.
export const isValidUrl = (url) => {
  if (!url) {
    return true;
  }
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

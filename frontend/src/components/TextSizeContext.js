import React, { createContext, useState, useContext } from 'react';

// Create a context for managing text size settings
const TextSizeContext = createContext();

/**
 * Custom hook to consume the text size context.
 * @returns {Object} - An object containing the current text size and a function to toggle the text size.
 * @throws Will throw an error if used outside the TextSizeProvider.
 */
export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};

/**
 * Provider component for managing text size settings.
 * @param {Object} props - The properties passed to the TextSizeProvider component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} - The JSX element representing the TextSizeProvider.
 */
export const TextSizeProvider = ({ children }) => {
  // Define state for managing text size
  const [textSize, setTextSize] = useState('normal');

  // Function to toggle text size between 'normal' and 'large'
  const toggleTextSize = () => {
    setTextSize((prevSize) => (prevSize === 'normal' ? 'large' : 'normal'));
  };

  // Render the provider with the current text size and toggle function
  return (
    <TextSizeContext.Provider value={{ textSize, toggleTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

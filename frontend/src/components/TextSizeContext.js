import React, { createContext, useState, useContext } from 'react';

const TextSizeContext = createContext();

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState('normal');

  const toggleTextSize = () => {
    setTextSize((prevSize) => (prevSize === 'normal' ? 'large' : 'normal'));
  };

  return (
    <TextSizeContext.Provider value={{ textSize, toggleTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

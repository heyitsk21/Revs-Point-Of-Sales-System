// TextSizeContext.js
import React, { createContext, useState, useContext } from 'react';

const TextSizeContext = createContext();

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState('medium');

  const toggleTextSize = () => {
    setTextSize(textSize === 'medium' ? 'large' : 'medium');
  };

  return (
    <TextSizeContext.Provider value={{ textSize, toggleTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => useContext(TextSizeContext);

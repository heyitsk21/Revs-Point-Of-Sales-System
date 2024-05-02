import React, { useEffect, useRef } from 'react';

/**
 * Component for embedding Google Translate functionality.
 * @returns {JSX.Element} - The JSX element representing the GoogleTranslate component.
 */
function GoogleTranslate() {
  // Reference to the div where Google Translate will be rendered
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    let intervalId;

    // Check if Google Translate is available at intervals
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        clearInterval(intervalId);
        // Initialize Google Translate once available
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          googleTranslateRef.current
        );
      }
    };

    // Set up interval to check for Google Translate
    intervalId = setInterval(checkGoogleTranslate, 100);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Render a div to contain the Google Translate widget
  return (
    <div>
      <div ref={googleTranslateRef}></div>
    </div>
  );
}

export default GoogleTranslate;

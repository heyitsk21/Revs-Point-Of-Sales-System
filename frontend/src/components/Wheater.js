import React, { useEffect, useState } from "react";

/**
 * Weather component to display weather information and corresponding image.
 * @returns {JSX.Element} - The JSX element representing the Weather component.
 */
export default function Weather() {
  // State variables to store latitude, longitude, and weather data
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);

  /**
   * Function to render the appropriate image based on weather data.
   * @returns {JSX.Element} - The JSX element representing the image.
   */
  const renderRev = () => {
    // Conditional rendering based on weather data
    if (data) {
      switch (data) {
        case 'mist':
          // Do something for misty weather
          break;
        default:
          // Default case
          break;
      }
    }

    // Render Rev image
    return (
      <img id='rev image' src={'/Images/Revs/coldRev.png'} alt={'rev'} width="25%" />
    );
  };

  useEffect(() => {
    /**
     * Function to fetch weather data from OpenWeatherMap API based on user's location.
     */
    const fetchData = async () => {
      if (navigator.geolocation) {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLong(longitude);
            setLat(latitude);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }

      // Fetch weather data using latitude and longitude
      await fetch(`https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=d735d8066386f83fe40b6fc4562811f6`)
        .then(res => res.json())
        .then(result => {
          setData(result)
          console.log(result);
        });
    };
    // Call fetchData function
    fetchData();

    // Log latitude and longitude to console
    console.log("Latitude is:", lat)
    console.log("Longitude is:", long)
  }, [lat, long]);

  // Render Weather component
  return (
    <div className="Weather">
      {renderRev()}
    </div>
  );
}
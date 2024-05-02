import React, { useEffect, useState } from "react";

/**
 * Weather component to display weather information and corresponding image.
 * @returns {JSX.Element} - The JSX element representing the Weather component.
 */
export default function Weather() {
  // State variables to store latitude, longitude, and weather data
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Function to render the appropriate image based on weather data.
   * @returns {JSX.Element} - The JSX element representing the image.
   */
  const renderRev = () => {
    let revpath = "/Images/Revs/rev.png";
    if (data && data.weather && data.weather[0].main) {
      switch (data.weather[0].main) {
        case 'Clouds':
          revpath = "/Images/Revs/cloudRev.png";
          break;
        case 'Snow':
          revpath = "/Images/Revs/coldRev.png";
          break;
        case 'Clear':
          revpath = "/Images/Revs/hotRev.png";
          break;
        case 'Rain':
          revpath = "/Images/Revs/wetRev.png";
          break;
        case 'Thunderstorm':
        case 'Drizzle':
        case 'Mist':
          revpath = "/Images/Revs/wetRev.png";
          break;
        default:
          break;
      }
    }

    return (
      <img id='rev image' src={revpath} alt={'rev'} width="50%" />
    );
  };

  useEffect(() => {
    let geoLocationWatcher;

    const fetchData = async (latitude, longitude) => {
      await fetch(`https://api.openweathermap.org/data/2.5/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=d88e44c8b49852f7c40ba58e1877d18c`)
        .then(res => res.json())
        .then(result => {
          setData(result);
          console.log(result);
        });
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        geoLocationWatcher = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLat(latitude);
            setLong(longitude);
            console.log(lat);
            console.log(long);
            fetchData(latitude, longitude);
            navigator.geolocation.clearWatch(geoLocationWatcher);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    getLocation();



    return () => {
      if (geoLocationWatcher) {
        navigator.geolocation.clearWatch(geoLocationWatcher);
      }
    };
  }, [lat,long]);

  return (
    <div className="Weather">
      {data ? (
        <div>
        <div className="custheader-child">
          {renderRev()}
        </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

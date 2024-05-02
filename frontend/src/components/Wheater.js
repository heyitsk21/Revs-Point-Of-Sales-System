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
    let revpath = "/Images/Revs/rev.png";
    if(data.weather[0].main){
        switch(data.weather[0].main){
            case 'Clouds':
                revpath = "/Images/Revs/cloudRev.png"
                break;
            case 'Snow':
                revpath = "/Images/Revs/coldRev.png"
                break;           
            case 'Clear':
                revpath = "/Images/Revs/hotRev.png"
                break;   
            case 'Rain':
                revpath = "/Images/Revs/wetRev.png"
                break;     
            case 'Thunderstorm':
                revpath = "/Images/Revs/wetRev.png"
                break; 
            case 'Drizzle':
                revpath = "/Images/Revs/wetRev.png"
                break;    
            case 'Mist':
                revpath = "/Images/Revs/wetRev.png"
                break;       
            default:
                break;
        }
    }


    return(
    <img id='rev image' src={revpath} alt={'rev'} width="10%" />
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
    <div className="Wheater">
        {(typeof data.main != 'undefined') ? (
        <div>
        <p>Temperature {data.main.temp} &deg;C</p>
        {renderRev()}
        </div>
      ): (
        <div></div>
      )}

    </div>
  );
}
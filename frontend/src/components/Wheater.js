
import React, { useEffect, useState } from "react";
export default function Wheater() {

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);
  const renderRev = () => {
    if(data){
        switch(data){
            case 'mist':
                break;
            default:
                break;
        }
    }


    return(
    <img id='rev image' src={'/Images/Revs/coldRev.png'} alt={'rev'} width="25%" />
    );
};

  useEffect(() => {



    const fetchData = async () => {

        if (navigator.geolocation) {

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
          }
          else {
            console.error('Geolocation is not supported by this browser.');
          }
        
      await fetch(`https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=d735d8066386f83fe40b6fc4562811f6`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result);
      });
      }
      fetchData();

    console.log("Latitude is:", lat)
    console.log("Longitude is:", long)
  }, [lat, long]);

  return (
    <div className="Wheater">
        {renderRev()}
    </div>
  );
}
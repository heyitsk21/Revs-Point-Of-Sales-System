
import React,{useEffect,useRef} from 'react';

function GoogleTranslate() {
    const googleTranslateRef = useRef(null);

    useEffect(() => {
        let intervalId;

        const checkGoogleTranslate = () =>{
            if(window.google && window.google.translate){
                clearInterval(intervalId);
                new window.google.translate.TranslateElement(
                    {pageLanguage: 'en'},
                    googleTranslateRef.current
                );
            }
        };
        intervalId = setInterval(checkGoogleTranslate,100);

    },[]);
    return (<div>
        <div ref = {googleTranslateRef}></div>
    </div>);
}


export default GoogleTranslate;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ConfirmPopup.css'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react/dist-src/index';
import '@djthoms/pretty-checkbox';

function Customize(props) {
  //using the item id, get the potential customization options
  const [options, setOptions] = useState([]);
  const checkbox = useCheckboxState({ state: [] });

  const fetchOptions = async (id) => {
    const payload = {
      menuitemid:id
    };
    try {
        console.log(id);
        const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations', payload);
        setOptions(response.data);
    } catch (error) {
        console.error('Error fetching customization options:', error);
    }
  };

  function handleDone(event) {
    props.setTrigger(false);
    //save customizations
  }

  useEffect(() => {
    fetchOptions(props.trigger);
  }, [props.trigger]);

  return (props.trigger) ? (
    <div className = 'popup'>
        <div className= 'popup-inner'>
            { props.children }
            {options.map(option => (
              <div key={option.orderid} className="customization">
                <Checkbox color="primary" value={option.ingredientname} {...checkbox}>{option.ingredientname}</Checkbox>
              </div>
            ))}
            <p>Selected items: {checkbox.state.join(', ')}</p>
            <button className='done' onClick={() => handleDone()}>Done Customizing</button>
        </div>
    </div>
  ) : "";
}

export default Customize


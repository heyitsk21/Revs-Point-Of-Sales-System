import React, { useState, useEffect } from 'react';
import '../ConfirmPopup.css'
import axios from 'axios';
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react/dist-src/index';
import '@djthoms/pretty-checkbox';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

function ConfirmSubmit(props) {
  const [options, setOptions] = useState([]);
  const checkbox = useCheckboxState({ state: [] });
  const [checkboxState, setCheckboxState] = useState({});

  const sendToDatabase = async (name) => {
    try {
      const orderData = {
        menuitems: props.trigger.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          customizations: Object.keys(checkboxState[item.id] || {}).filter(option => checkboxState[item.id][option])
        })),
        customername: name,
        employeeid: 1 //TODO change to whichever employee is logged in
      };

      const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/placeorder', orderData);
      console.log('Order submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const fetchOptions = async (id) => {
    const payload = {
      menuitemid:id
    };
    try {
        console.log(id);
        const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations', payload);
        const filteredOptions = options.filter(option => option.id !== id);
        setOptions(prevOptions => [...filteredOptions, { id: id, options: response.data }]);
    } catch (error) {
        console.error('Error fetching customization options:', error);
    }
  };

  useEffect(() => {
    console.log('Trigger items:', props.trigger.items);
    if (props.trigger && props.trigger.items.length > 0) {
      props.trigger.items.forEach(item => {
        fetchOptions(item.id);
      });
    }
  }, [props.trigger, props.trigger.items]);

  function handleSubmit(event) {
    event.preventDefault();
    props.setTrigger(false);
    props.emptyCart();
    const name = event.target.name.value;
    sendToDatabase(name);
  }

  function handleCheckboxChange(itemId, optionName) {
    setCheckboxState(prevState => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        [optionName]: !prevState[itemId]?.[optionName]
      }
    }));
  }

  return (props.trigger) ? (
    <div className = 'popup'>
        <div className= 'popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>Not Yet</button>
            <h3>Please select items to add, or deselect items to remove.</h3>
            <SimpleBar style={{ height: 400, width: 600}}>
              {props.trigger.items.map((item, index)=> (
                  <div key={index}>
                      <div>{item.name}</div>
                      <div>${(item.quantity * item.price).toFixed(2)}</div>
                      <div className='quantity'>{item.quantity}</div>
                      {options.map(option => {
                        if (option.id === item.id) {
                          return option.options.map((customization, idx) => (
                            <div key={idx} className="customization">
                              <Checkbox 
                                  color="primary" 
                                  checked={checkboxState[item.id]?.[customization.ingredientname] || false} 
                                  onChange={() => handleCheckboxChange(item.id, customization.ingredientname)}>
                                {customization.ingredientname}
                              </Checkbox>
                            </div>
                          ));
                        }
                        return null;
                      })}
                      <p>Selected items: {Object.keys(checkboxState[item.id] || {}).filter(option => checkboxState[item.id][option]).join(', ')}</p>
                  </div>
              ))}
            </SimpleBar>

            <h3>Please enter your name and press Submit to finalize your order.</h3>
            <form>
              <label className='label'>
                <div className='prompt'>
                  Name:
                  <input type="text" name="name" />
                </div>
              </label>
              <input type="submit" className='confirm' value="Submit" onClick={() => handleSubmit()}/>
            </form>
        </div>
    </div>
  ) : "";
}

export default ConfirmSubmit

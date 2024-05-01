import React, { useState, useEffect } from 'react';
import '../ConfirmPopup.css'
import axios from 'axios';
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react/dist-src/index';
import '@djthoms/pretty-checkbox';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

function ConfirmSubmit(props) {
  const [options, setOptions] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});

  const generateUniqueId = (item, index) => `${item.id}_${index}`;

  const sendToDatabase = async (name) => {
    try {
      if (!name) {
        console.error("Customer name is required.");
        return;
      }

      const employeeID = parseInt(localStorage.getItem('userID'));
      if (isNaN(employeeID)) {
        console.error("Employee ID is not a valid integer.");
        return;
      }

      const orderData = {
        menuitems: props.trigger.items.flatMap(item => 
          Array.from({ length: item.quantity }, (_, index) => ({
            key: `${item.id}_${index}`, // Unique key based on item id and index
            menuid: item.id,
            customizationids: Object.keys(checkboxState[`${item.id}_${index}`] || {}).filter(option => checkboxState[`${item.id}_${index}`][option])
          }))
        ),
        customername: name,
        employeeid: employeeID
      };

      /*{
        "menuitems": [
          {
            "menuid": 0,
            "customizationids": [
              0
            ]
          }
        ],
        "customername": "string",
        "employeeid": 0
      }*/

      const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/placeorder', orderData);
      console.log('Order submitted successfully:', response.data);
      props.emptyCart();
      props.setTrigger(false);
    } catch (error) {
      console.error('Error submitting order:', error.response.data);
    }
  };

  const fetchOptions = async (id) => {
    const payload = {
      menuitemid:id
    };
    try {
        const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations', payload);
        const filteredOptions = options.filter(option => option.id !== id);
        setOptions(prevOptions => [...filteredOptions, { id: id, options: response.data }]);
    } catch (error) {
        console.error('Error fetching customization options:', error);
    }
  };

  useEffect(() => {
    if (props.trigger && props.trigger.items.length > 0) {
      props.trigger.items.forEach(item => {
        fetchOptions(item.id);
      });
    }
  }, [props.trigger, props.trigger.items]);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    sendToDatabase(name);
  }

  function handleCheckboxChange(uniqueID, optionName) {
    setCheckboxState(prevState => ({
      ...prevState,
      [uniqueID]: {
        ...prevState[uniqueID],
        [optionName]: !prevState[uniqueID]?.[optionName]
      }
    }));
  }

  return (props.trigger) ? (
    <div className = 'confirm-popup'>
        <div className= 'confirm-popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>Not Yet</button>
            <h3>Please select any add-ons you would like.</h3>
            <SimpleBar style={{ height: 400, width: 600}}>
              {props.trigger.items.map(item => (
                <div key={item.uniqueID}>
                  {[...Array(item.quantity)].map((_, i) => (
                    <div key={generateUniqueId(item, props.trigger.items.indexOf(item))}>
                      <div>{item.name}</div>
                      <div>${(1 * item.price).toFixed(2)}</div>
                      {options.map(option => {
                        if (option.id === item.id) {
                          return option.options.map((customization, idx) => (
                            <div key={idx} className="customization">
                              <Checkbox
                                color="primary"
                                checked={checkboxState[`${generateUniqueId(item, props.trigger.items.indexOf(item))}_${i}`]?.[customization.ingredientname] || false}
                                onChange={() => handleCheckboxChange(`${generateUniqueId(item, props.trigger.items.indexOf(item))}_${i}`, customization.ingredientname)}
                              >
                                {customization.ingredientname}
                              </Checkbox>
                            </div>
                          ));
                        }
                        return null;
                      })}
                      {options.some(option => option.id === item.id && option.options.length > 0) && (
                        <p>Selected items: {Object.keys(checkboxState[`${generateUniqueId(item, props.trigger.items.indexOf(item))}_${i}`] || {}).filter(option => checkboxState[`${generateUniqueId(item, props.trigger.items.indexOf(item))}_${i}`][option]).join(', ')}</p>
                      )}
                      <p> - - - </p>
                    </div>
                  ))}
                </div>
              ))}
            </SimpleBar>

            <h3>Please enter your name and press Submit to finalize your order.</h3>
            <form onSubmit={handleSubmit}>
              <label className='label'>
                <div className='prompt'>
                  Name: 
                  <input type="text" name="name" />
                </div>
              </label>
              <input type="submit" className='confirm' value="Submit" />
            </form>
        </div>
    </div>
  ) : "";
}

export default ConfirmSubmit

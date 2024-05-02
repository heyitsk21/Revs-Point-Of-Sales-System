import React, { useState, useEffect } from 'react';
import '../ConfirmPopup.css'
import axios from 'axios';
import { Checkbox } from 'pretty-checkbox-react/dist-src/index';
import '@djthoms/pretty-checkbox';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import RevThankYou from '../../../components/RevThankYou';

/**
 * ConfirmSubmit component to confirm submitting the order.
 * @param {object} props - Props passed to the component.
 * @param {object} props.trigger - Trigger state to control the visibility of the confirmation popup.
 * @param {function} props.setTrigger - Function to set the trigger state.
 * @param {function} props.emptyCart - Function to empty the cart.
 * @returns {JSX.Element} - The JSX element representing the ConfirmSubmit component.
 */
function ConfirmSubmit(props) {
  const [options, setOptions] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});

  /**
   * Controls the visibility of the 'Thank You' review modal.
   * @type {boolean}
   */
  const [showRevThankYou, setShowRevThankYou] = useState(false);

  /**
   * Function to send the order to the database.
   * @param {string} name - The name of the customer.
   */
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

      console.log("Trigger items:", props.trigger.items);
      const orderData = {
        menuitems: props.trigger.items.flatMap((item) => 
          [...Array(item.quantity)].map(() => {
            const uniqueID = item.uniqueID;
            console.log("Logging checkboxState[uniqueID] when constructing orderData:", checkboxState[uniqueID]);
            return {
              key: uniqueID,
              menuid: item.id,
              customizationids: Object.keys(checkboxState[uniqueID] || {}).map(Number) || [],
            };
          })
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
      console.log("Order data before sending:", orderData);

      const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/placeorder', orderData);
      console.log('Order submitted successfully:', orderData);
      props.emptyCart();
    } catch (error) {
      console.error('Error submitting order:', error.response.data);
    }
  };

  /**
   * Function to fetch customization options.
   * @param {number} id - The ID of the menu item.
   */
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

  /**
   * Function to handle form submission.
   * @param {Event} event - The form submission event.
   */
  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    sendToDatabase(name);
    setShowRevThankYou(true);
  }

  /**
   * Function to handle checkbox change.
   * @param {string} uniqueID - The unique ID of the item.
   * @param {string} optionName - The name of the customization option.
   */
  function handleCheckboxChange(uniqueID, optionID) {
    console.log("Before updating checkboxState:");
    console.log("uniqueID:", uniqueID);
    console.log("checkboxState[uniqueID]:", checkboxState[uniqueID]);

    setCheckboxState(prevState => {
      const newState = { ...prevState };
      newState[uniqueID] = { ...(newState[uniqueID] || {}) };
      if (newState[uniqueID][optionID]) {
        delete newState[uniqueID][optionID];
      } else {
        newState[uniqueID][optionID] = true;
      }

      console.log("After updating checkboxState:");
      console.log("uniqueID:", uniqueID);
      console.log("newState[uniqueID]:", newState[uniqueID]);

      return newState;
    });
  }

  return (props.trigger) ? (
    <div className='confirm-popup'>
        <div className='confirm-popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>Not Yet</button>
            <h3>Please select any add-ons you would like.</h3>
            <SimpleBar style={{ height: 200, width: 600}}>
              {props.trigger.items.map(item => (
                <div key={item.uniqueID}>
                  <div>{item.name}</div>
                  <div>${(1 * item.price).toFixed(2)}</div>
                  {options.map(option => {
                    if (option.id === item.id) {
                      return option.options.map((customization, idx) => (
                        <div key={idx} className="customization">
                          <Checkbox
                            color="primary"
                            checked={checkboxState[item.uniqueID]?.[customization.ingredientid] || false}
                            onChange={() => handleCheckboxChange(item.uniqueID, customization.ingredientid)}
                          >
                            {customization.ingredientname}
                          </Checkbox>
                        </div>
                      ));
                    }
                    return null;
                  })}
                  {options.some(option => option.id === item.id && option.options.length > 0) && (
                    <p>Selected items: {Object.keys(checkboxState[item.uniqueID] || {}).filter(option => checkboxState[item.uniqueID][option]).join(', ')}</p>
                  )}
                  {/* <p> - - - </p> */}
                  <hr></hr>
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
        {showRevThankYou && (
          <RevThankYou
            onAnimationEnd={() => {
              setShowRevThankYou(false);
              props.setTrigger(false); 
            }}
          />
        )}
    </div>
  ) : null;
}

export default ConfirmSubmit

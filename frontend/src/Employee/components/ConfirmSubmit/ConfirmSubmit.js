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

  const sendToDatabase = async (name) => {
    try {
      const orderData = {
        menuitems: props.trigger.items.map(item => item.id), // 
        customername: name,
        employeeid: 1 
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
        setOptions(prevOptions => [...prevOptions, {id: id, options: response.data}]);
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
    props.setTrigger(false);
    props.emptyCart();
    const name = event.target.name.value;
    sendToDatabase(name);
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
                              <Checkbox color="primary" value={customization.ingredientname} {...checkbox}>{customization.ingredientname}</Checkbox>
                            </div>
                          ));
                        }
                        return null;
                      })}
                      <p>Selected items: {checkbox.state.join(', ')}</p>
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

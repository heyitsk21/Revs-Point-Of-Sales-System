import React from 'react'
import '../ConfirmPopup.css'
import axios from 'axios';

function ConfirmSubmit(props) {
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
            { props.children }
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

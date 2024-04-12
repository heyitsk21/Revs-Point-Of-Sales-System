import React from 'react'
import '../ConfirmPopup.css'

function ConfirmClearOrder(props) {
  function handleClearOrder() {
    props.setTrigger(false);
    props.emptyCart();
  }

  return (props.trigger) ? (
    <div className = 'popup'>
        <div className= 'popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>No</button>
            { props.children }
            <button className='confirm'  onClick={() => handleClearOrder()}>Clear Order</button>
        </div>
    </div>
  ) : "";
}

export default ConfirmClearOrder

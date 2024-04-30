import React from 'react'
import '../ConfirmPopup.css'

function ConfirmClearOrder(props) {
  function handleClearOrder() {
    props.setTrigger(false);
    props.emptyCart();
  }

  return (props.trigger) ? (
    <div className = 'confirm-popup'>
        <div className= 'confirm-popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>No</button>
            { props.children }
            <button className='confirm-button'  onClick={() => handleClearOrder()}>Clear Order</button>
        </div>
    </div>
  ) : "";
}

export default ConfirmClearOrder

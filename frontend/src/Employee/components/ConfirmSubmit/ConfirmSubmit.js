import React from 'react'
import '../ConfirmPopup.css'

function ConfirmSubmit(props) {
  function handleSubmit() {
    props.setTrigger(false);
    props.emptyCart();
  }

  return (props.trigger) ? (
    <div className = 'popup'>
        <div className= 'popup-inner'>
            <button className='close' onClick={() => props.setTrigger(false)}>Not Yet</button>
            { props.children }
            <button className='confirm'  onClick={() => handleSubmit()}>Confirm</button>
        </div>
    </div>
  ) : "";
}

export default ConfirmSubmit

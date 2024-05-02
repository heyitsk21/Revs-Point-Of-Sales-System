import React from 'react'
import '../ConfirmPopup.css'

/**
 * ConfirmClearOrder component to confirm clearing the order.
 * @param {object} props - Props passed to the component.
 * @param {boolean} props.trigger - Trigger state to control the visibility of the confirmation popup.
 * @param {function} props.setTrigger - Function to set the trigger state.
 * @param {function} props.emptyCart - Function to empty the cart.
 * @returns {JSX.Element} - The JSX element representing the ConfirmClearOrder component.
 */
function ConfirmClearOrder(props) {
  /**
   * Function to handle clearing the order.
   */
  function handleClearOrder() {
    props.setTrigger(false);
    props.emptyCart();
  }

  // Render the confirmation popup if trigger is true
  return (props.trigger) ? (
    <div className='confirm-popup'>
      <div className='confirm-popup-inner'>
        {/* Button to cancel clearing the order */}
        <button className='close' onClick={() => props.setTrigger(false)}>No</button>
        {/* Content passed as children */}
        {props.children}
        {/* Button to confirm clearing the order */}
        <button className='confirm-button' onClick={() => handleClearOrder()}>Clear Order</button>
      </div>
    </div>
  ) : null; // Return null if trigger is false
}

export default ConfirmClearOrder

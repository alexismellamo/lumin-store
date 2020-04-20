import React from "react";
import Drawer from "@material-ui/core/Drawer";
import "./side-bar.scss";

function Quantity({ quantity, onAddOne, onRemoveOne }) {
  return (
    <div className="quantity--container">
      <button onClick={onRemoveOne}>-</button>
      <p className="quantity--text">{quantity}</p>
      <button onClick={onAddOne}>+</button>
    </div>
  );
}

function SideBar({
  currency,
  currentCurrency,
  onCurrentCurrencyChange,
  cart,
  open,
  onClose,
  onAddOne,
  onRemoveOne,
  onRemoveAll,
  subtotal
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="side-bar--container">
        <div className="side-bar--close-drawer-container">
          <button className="close-drawer" onClick={onClose}>
            {"<"}
          </button>
          <h3>YOUR CART</h3>
          <div />
        </div>
        <div className="side-bar--currency-container">
          <select
            value={currentCurrency}
            onChange={ev => onCurrentCurrencyChange(ev.target.value)}
          >
            {currency.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="cart--container">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map(product => (
              <div key={product.id} className="cart--product">
                <button
                  className="close"
                  onClick={() => onRemoveAll(product.id)}
                >
                  x
                </button>
                <div className="cart--product__info">
                  <p className="title">{product.title}</p>
                  <div className="cart--product__info__quantity-price">
                    <Quantity
                      quantity={product.quantity}
                      onAddOne={() => onAddOne(product.id)}
                      onRemoveOne={() => onRemoveOne(product.id)}
                    />
                    <p>${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div className="cart--product__image">
                  <img src={product.image_url} alt={product.title} />
                </div>
              </div>
            ))
          )}
        </div>
        <footer>
          <div className="subtotal--container">
            <p className="subtotal--label">Subtotal</p>
            <p className="subtotal--price">${subtotal?.toFixed(2)}</p>
          </div>
          <button className="subscription">
            Make this a subscription (save 20%)
          </button>
          <button className="checkout">Proceed to checkout</button>
        </footer>
      </div>
    </Drawer>
  );
}

export default SideBar;

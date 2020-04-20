/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import logo from "./lumin-logo.jpg";
import cart from "./cart.svg";
import "./nav.scss";

function Nav({ cartSize, onOpenCart }) {
  return (
    <nav className="nav">
      <img src={logo} className="nav--logo" alt="Lumin logo" />
      <div className="nav--links">
        <a href="#" className="nav--link">
          Shop
        </a>
        <a href="#" className="nav--link">
          Learn
        </a>
      </div>
      <div className="nav--shop-account">
        <a href="#" className="nav--account">
          Account
        </a>
        <div className="nav--cart">
          <button onClick={onOpenCart}>
            <img src={cart} alt="shopping cart icon" />
          </button>
          {<span>{cartSize}</span>}
        </div>
      </div>
    </nav>
  );
}

export default Nav;

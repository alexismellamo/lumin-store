import React from "react";
import "./hero.scss";

const blockname = "hero";

function Hero() {
  return (
    <div className={blockname}>
      <div className={`${blockname}--header`}>
        <h1>All Products</h1>
        <span>A 360° look at Lumin</span>
      </div>
      <div className={`${blockname}--filter`}>
        <div className="fake-dropdown">Filter By</div>
      </div>
    </div>
  );
}

export default Hero;

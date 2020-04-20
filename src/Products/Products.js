import React from "react";
import "./products.scss";

function Product({ title, image_url: imageURL, price, onAddToCart }) {
  return (
    <div className="product">
      <div className="product--image-container">
        <img src={imageURL} alt={title} />
      </div>
      <h2>{title}</h2>
      <p className="product--price">From ${price.toFixed(2)}</p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}

const blockname = "products";
function Products({ products, onAddToCart }) {
  return (
    <div className={`${blockname}`}>
      {products.map(product => (
        <Product
          key={product.id}
          {...product}
          onAddToCart={() => onAddToCart(product.id)}
        />
      ))}
    </div>
  );
}

export default Products;

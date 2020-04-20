import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import { createPersistedState, useCart } from "./hooks";

import Nav from "./Nav";
import Hero from "./Hero";
import Products from "./Products";
import "./App.scss";
import SideBar from "./SideBar";
import gql from "graphql-tag";

const dataQuery = gql`
  query getData($currency: Currency!) {
    products {
      id
      title
      image_url
      price(currency: $currency)
    }
    currency
  }
`;

const useCurrency = createPersistedState("currency");

function App() {
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [open, setOpen] = useState(false);

  const [currentCurrency, setCurrentCurrency] = useCurrency("MXN");
  const { error, data } = useQuery(dataQuery, {
    variables: { currency: currentCurrency }
  });

  useEffect(() => {
    if (!data) return;
    setProducts(data.products);
    setCurrency(data.currency);
  }, [data]);

  const {
    cart,
    handleAddToCart,
    handleRemoveOne,
    handleRemoveAll,
    subtotal,
    cartSize
  } = useCart(products);

  if (error) return <p>Something went wrong. Please reload</p>;
  if (products.length === 0) return <p>Loading...</p>;

  return (
    <div className="App">
      <SideBar
        currency={currency}
        currentCurrency={currentCurrency}
        onCurrentCurrencyChange={newCurrency => setCurrentCurrency(newCurrency)}
        cart={cart}
        open={open}
        onClose={() => setOpen(false)}
        onAddOne={handleAddToCart}
        onRemoveOne={handleRemoveOne}
        onRemoveAll={handleRemoveAll}
        subtotal={subtotal}
      />
      <Nav cartSize={cartSize} onOpenCart={() => setOpen(true)} />
      <Hero />
      <Products
        products={products}
        onAddToCart={id => {
          handleAddToCart(id);
          setOpen(true);
        }}
      />
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";

export const useEventListener = (eventName, handler, element = global) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = event => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

const globalState = {};

const createGlobalState = (key, thisCallback, initialValue) => {
  if (!globalState[key]) {
    globalState[key] = { callbacks: [], value: initialValue };
  }
  globalState[key].callbacks.push(thisCallback);
  return {
    deregister() {
      const arr = globalState[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value) {
      if (globalState[key].value !== value) {
        globalState[key].value = value;
        globalState[key].callbacks.forEach(callback => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    }
  };
};

const usePersistedState = (initialState, key, { get, set }) => {
  const globalState = useRef(null);
  const [state, setState] = useState(() => get(key, initialState));

  // subscribe to `storage` change events
  useEventListener("storage", ({ key: k, newValue }) => {
    if (k === key) {
      const newState = JSON.parse(newValue);
      if (state !== newState) {
        setState(newState);
      }
    }
  });

  // only called on mount
  useEffect(() => {
    // register a listener that calls `setState` when another instance emits
    globalState.current = createGlobalState(key, setState, initialState);

    return () => {
      globalState.current.deregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only persist to storage if state changes.
  useEffect(() => {
    // persist to localStorage
    set(key, state);

    // inform all of the other instances in this tab
    globalState.current.emit(state);
  }, [key, set, state]);

  return [state, setState];
};

const createStorage = provider => ({
  get(key, defaultValue) {
    const json = provider.getItem(key);
    // eslint-disable-next-line no-nested-ternary
    return json === null
      ? typeof defaultValue === "function"
        ? defaultValue()
        : defaultValue
      : JSON.parse(json);
  },
  set(key, value) {
    provider.setItem(key, JSON.stringify(value));
  }
});

export const createPersistedState = (key, provider = global.localStorage) => {
  if (provider) {
    const storage = createStorage(provider);
    return initialState => usePersistedState(initialState, key, storage);
  }
  return useState;
};

export function getLocalStorageValue(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setLocalStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(getLocalStorageValue(key) || defaultValue);

  useEffect(() => {
    setLocalStorage(key, state);
  });

  return [state, setState];
}

function removeKey(object, key) {
  return Object.fromEntries(
    Object.entries(object).filter(([_key]) => key !== _key)
  );
}

const useCartState = createPersistedState("cart");
export function useCart(products) {
  const [cart, setCart] = useCartState({});

  function handleAddToCart(id) {
    setCart(cart => {
      const currentQuantity = cart[id]?.quantity || 0;
      const quantity = currentQuantity + 1;
      return { ...cart, [id]: { quantity, id } };
    });
  }

  function handleRemoveOne(id) {
    setCart(cart => {
      if (!cart[id]) return cart; // if does not exist, does nothing
      const currentQuantity = cart[id].quantity;
      const quantity = currentQuantity - 1;
      if (quantity === 0) {
        // remove of the cart immutable
        const newCart = removeKey(cart, id.toString()); // keys are string
        return newCart;
      }
      return { ...cart, [id]: { quantity, id } };
    });
  }

  function handleRemoveAll(id) {
    setCart(cart => {
      const newCart = removeKey(cart, id.toString()); // keys are string
      return newCart;
    });
  }

  const cartWithData = Object.values(cart).map(({ id, quantity }) => ({
    ...products.find(product => product.id === id),
    quantity
  }));

  const subtotal = cartWithData.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const cartSize = cartWithData.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  return {
    cart: cartWithData,
    handleAddToCart,
    handleRemoveOne,
    handleRemoveAll,
    subtotal,
    cartSize
  };
}

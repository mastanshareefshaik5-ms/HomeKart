import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {
    return [];
  });


  // SAVE CART
  const saveCart = (items) => {
    setCartItems(items);
  };


  // ADD TO CART
  const addToCart = (product) => {

    const productId = String(product._id);

    const existingProduct = cartItems.find(
      (item) => String(item._id) === productId
    );

    if (existingProduct) {

      const updatedCart = cartItems.map((item) => {

        if (String(item._id) === productId) {

          return {
            ...item,
            quantity: Number(item.quantity) + 1
          };

        }

        return item;

      });

      saveCart(updatedCart);

    } else {

      const newProduct = {
        _id: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
        icon: product.icon,
        brand: product.brand,
        price: Number(product.price),
        quantity: 1
      };

      saveCart([
        ...cartItems,
        newProduct
      ]);

    }
  };


  // INCREASE
  const increaseQuantity = (productId) => {

    const updatedCart = cartItems.map((item) => {

      if (String(item._id) === String(productId)) {

        return {
          ...item,
          quantity: Number(item.quantity) + 1
        };

      }

      return item;

    });

    saveCart(updatedCart);
  };


  // DECREASE
  const decreaseQuantity = (productId) => {

    const updatedCart = cartItems
      .map((item) => {

        if (String(item._id) === String(productId)) {

          return {
            ...item,
            quantity: Number(item.quantity) - 1
          };

        }

        return item;

      })
      .filter(
        (item) => Number(item.quantity) > 0
      );

    saveCart(updatedCart);
  };


  // REMOVE
  const removeFromCart = (productId) => {

    const updatedCart = cartItems.filter(
      (item) =>
        String(item._id) !== String(productId)
    );

    saveCart(updatedCart);
  };


  // CLEAR
  const clearCart = () => {
    saveCart([]);
  };


  // TOTAL
  const cartTotal = cartItems.reduce(
    (total, item) => {

      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (
        Number.isNaN(price) ||
        Number.isNaN(quantity)
      ) {
        return total;
      }

      return total + price * quantity;

    },
    0
  );


  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal
      }}
    >

      {children}

    </CartContext.Provider>

  );
}
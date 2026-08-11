import {
  createContext,
  useState
} from "react";

export const CartContext =
  createContext();


export function CartProvider({
  children
}) {

  // ==========================================
  // CART
  // ==========================================

  const [cartItems, setCartItems] =
    useState(() => {

      try {

        const savedCart =
          localStorage.getItem(
            "homekart-cart"
          );

        return savedCart
          ? JSON.parse(savedCart)
          : [];

      } catch (error) {

        console.error(
          "CART LOAD ERROR:",
          error
        );

        return [];

      }

    });


  // ==========================================
  // WISHLIST
  // ==========================================

  const [wishlist, setWishlist] =
    useState(() => {

      try {

        const savedWishlist =
          localStorage.getItem(
            "homekart-wishlist"
          );

        return savedWishlist
          ? JSON.parse(savedWishlist)
          : [];

      } catch (error) {

        console.error(
          "WISHLIST LOAD ERROR:",
          error
        );

        return [];

      }

    });


  // ==========================================
  // SAVE CART
  // ==========================================

  const saveCart = (items) => {

    setCartItems(items);

    localStorage.setItem(
      "homekart-cart",
      JSON.stringify(items)
    );

  };


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {

    if (!product?._id) {
      return;
    }

    const productId =
      String(product._id);


    const existingProduct =
      cartItems.find(
        (item) =>
          String(item._id) ===
          productId
      );


    if (existingProduct) {

      const updatedCart =
        cartItems.map((item) => {

          if (
            String(item._id) ===
            productId
          ) {

            return {
              ...item,
              quantity:
                Number(item.quantity) + 1
            };

          }

          return item;

        });

      saveCart(updatedCart);

    } else {

      const newProduct = {

        _id: product._id,

        name: product.name,

        description:
          product.description || "",

        image:
          product.image || "",

        icon:
          product.icon || "🛒",

        brand:
          product.brand || "HOMEKART",

        price:
          Number(product.price) || 0,

        quantity: 1

      };


      saveCart([
        ...cartItems,
        newProduct
      ]);

    }

  };


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity =
    (productId) => {

      const updatedCart =
        cartItems.map((item) => {

          if (
            String(item._id) ===
            String(productId)
          ) {

            return {
              ...item,
              quantity:
                Number(item.quantity) + 1
            };

          }

          return item;

        });


      saveCart(updatedCart);

    };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity =
    (productId) => {

      const updatedCart =
        cartItems
          .map((item) => {

            if (
              String(item._id) ===
              String(productId)
            ) {

              return {
                ...item,
                quantity:
                  Number(item.quantity) - 1
              };

            }

            return item;

          })
          .filter(
            (item) =>
              Number(item.quantity) > 0
          );


      saveCart(updatedCart);

    };


  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart =
    (productId) => {

      const updatedCart =
        cartItems.filter(
          (item) =>
            String(item._id) !==
            String(productId)
        );


      saveCart(updatedCart);

    };


  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {

    saveCart([]);

  };


  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal =
    cartItems.reduce(
      (total, item) => {

        const price =
          Number(item.price);

        const quantity =
          Number(item.quantity);


        if (
          Number.isNaN(price) ||
          Number.isNaN(quantity)
        ) {

          return total;

        }


        return (
          total +
          price * quantity
        );

      },
      0
    );


  // ==========================================
  // SAVE WISHLIST
  // ==========================================

  const saveWishlist =
    (items) => {

      setWishlist(items);

      localStorage.setItem(
        "homekart-wishlist",
        JSON.stringify(items)
      );

    };


  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  const addToWishlist =
    (product) => {

      if (!product?._id) {
        return;
      }


      const productId =
        String(product._id);


      const alreadyExists =
        wishlist.some(
          (item) =>
            String(item._id) ===
            productId
        );


      if (alreadyExists) {

        return;

      }


      const wishlistProduct = {

        _id: product._id,

        name: product.name,

        description:
          product.description || "",

        image:
          product.image || "",

        icon:
          product.icon || "🛒",

        brand:
          product.brand || "HOMEKART",

        price:
          Number(product.price) || 0,

        rating:
          Number(product.rating) || 0,

        category:
          product.category || "",

        stock:
          Number(product.stock) || 0

      };


      saveWishlist([
        ...wishlist,
        wishlistProduct
      ]);

    };


  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeFromWishlist =
    (productId) => {

      const updatedWishlist =
        wishlist.filter(
          (item) =>
            String(item._id) !==
            String(productId)
        );


      saveWishlist(
        updatedWishlist
      );

    };


  // ==========================================
  // CHECK WISHLIST
  // ==========================================

  const isInWishlist =
    (productId) => {

      return wishlist.some(
        (item) =>
          String(item._id) ===
          String(productId)
      );

    };


  // ==========================================
  // CLEAR WISHLIST
  // ==========================================

  const clearWishlist = () => {

    saveWishlist([]);

  };


  return (

    <CartContext.Provider
      value={{

        // CART
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        cartTotal,


        // WISHLIST
        wishlist,

        addToWishlist,

        removeFromWishlist,

        isInWishlist,

        clearWishlist

      }}
    >

      {children}

    </CartContext.Provider>

  );

}
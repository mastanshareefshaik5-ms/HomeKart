import { createContext, useState } from "react";

export const CartContext = createContext();


export function CartProvider({children}){


const [cartItems,setCartItems]=useState([]);



const addToCart=(product)=>{

setCartItems([
...cartItems,
product
]);

};



const removeFromCart=(index)=>{

const updatedItems = cartItems.filter(
(_,i)=>i!==index
);

setCartItems(updatedItems);

};



return(

<CartContext.Provider
value={{
cartItems,
addToCart,
removeFromCart
}}
>

{children}

</CartContext.Provider>

);

}
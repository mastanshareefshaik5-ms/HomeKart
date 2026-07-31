import "./Cart.css";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";


function Cart(){

const {cartItems, removeFromCart} = useContext(CartContext);


return(

<div className="cart-page">


<h1>
🛒 Your Cart
</h1>


{
cartItems.length === 0 ? (

<h2 className="empty-cart">
Your cart is empty
</h2>

)

:

(

<div className="cart-box">

{
cartItems.map((item,index)=>(

<div className="cart-item" key={index}>


<h3>
{item.name}
</h3>


<p>
₹{item.price}
</p>


<button
onClick={()=>removeFromCart(index)}
>
Remove
</button>


</div>

))
}


<h2>
Total: ₹
{
cartItems.reduce(
(total,item)=>total+item.price,
0
)
}
</h2>


<Link to="/checkout">

<button className="checkout-btn">
Proceed to Checkout
</button>

</Link>


</div>

)

}


</div>

);

}


export default Cart;
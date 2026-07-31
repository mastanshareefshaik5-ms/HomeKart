import "./Checkout.css";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";


function Checkout(){

const {cartItems}=useContext(CartContext);


const total = cartItems.reduce(
(total,item)=> total + item.price,
0
);


return(

<div className="checkout-page">


<h1>
🛍️ Checkout
</h1>



<div className="checkout-container">



<div className="address-box">


<h2>
Delivery Address
</h2>


<input
placeholder="Full Name"
/>


<input
placeholder="Mobile Number"
/>


<textarea
placeholder="Enter Address"
/>


</div>




<div className="payment-box">


<h2>
Order Summary
</h2>


{
cartItems.map((item,index)=>(

<p key={index}>
{item.name} - ₹{item.price}
</p>

))
}



<h2>
Total: ₹{total}
</h2>



<h3>
Payment Method
</h3>


<label>
<input type="radio" name="payment"/>
 Cash on Delivery
</label>


<br/>


<label>
<input type="radio" name="payment"/>
 UPI Payment
</label>



<button>
Place Order
</button>


</div>


</div>


</div>

);

}


export default Checkout;